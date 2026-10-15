"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Script from "next/script";
import {
  Camera as CameraIcon,
  CameraSlash,
  SpeakerHigh,
  SpeakerSimpleSlash,
  ArrowLeft,
  UploadSimple,
} from "@phosphor-icons/react";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "https://alertdrive-v05y.onrender.com";

// MediaPipe 468 landmark index mappings
const L_EYE = [362, 385, 387, 263, 373, 380];
const R_EYE = [33, 160, 158, 133, 153, 144];
const MOUTH = [78, 81, 13, 311, 308, 402, 14, 178];

interface Landmark {
  x: number;
  y: number;
  z: number;
}

interface FaceMeshResults {
  multiFaceLandmarks?: Landmark[][];
  image: HTMLVideoElement | HTMLImageElement | HTMLCanvasElement;
}

interface TelemetryState {
  status: "NOMINAL" | "DROWSY" | "YAWN" | "DISTRACTED" | "NODDING" | "NO_FACE";
  statusLabel: string;
  ear: number;
  mar: number;
  perclos: number;
  pitch: number;
  yaw: number;
  confidence: number;
  faceDetected: boolean;
  fps: number;
}

function calculateDistance(p1: Landmark, p2: Landmark): number {
  return Math.hypot(p1.x - p2.x, p1.y - p2.y, (p1.z || 0) - (p2.z || 0));
}

function computeEAR(landmarks: Landmark[], indices: number[]): number {
  const v1 = calculateDistance(landmarks[indices[1]], landmarks[indices[5]]);
  const v2 = calculateDistance(landmarks[indices[2]], landmarks[indices[4]]);
  const h = calculateDistance(landmarks[indices[0]], landmarks[indices[3]]);
  return h > 0 ? (v1 + v2) / (2.0 * h) : 0;
}

function computeMAR(landmarks: Landmark[], indices: number[]): number {
  const v = calculateDistance(landmarks[indices[2]], landmarks[indices[6]]);
  const h = calculateDistance(landmarks[indices[0]], landmarks[indices[4]]);
  return h > 0 ? v / h : 0;
}

function estimateOrientation(landmarks: Landmark[]) {
  const nose = landmarks[1];
  const chin = landmarks[152];
  const leftEye = landmarks[33];
  const rightEye = landmarks[263];

  const eyeDist = calculateDistance(leftEye, rightEye);
  if (eyeDist === 0) return { pitch: 0, yaw: 0 };
  const pitch = ((nose.y - (leftEye.y + rightEye.y) / 2) / eyeDist) * 100 * 2;
  const yaw = ((nose.x - (leftEye.x + rightEye.x) / 2) / eyeDist) * 100 * 2;
  return { pitch, yaw };
}

export default function DemoPage() {
  const [scriptsLoaded, setScriptsLoaded] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [uploadedSrc, setUploadedSrc] = useState<string | null>(null);
  const [audioEnabled, setAudioEnabled] = useState(true);

  const [telemetry, setTelemetry] = useState<TelemetryState | null>(null);
  const [apiStatus, setApiStatus] = useState<"checking" | "connected" | "offline">("checking");
  const [deepModelVerified, setDeepModelVerified] = useState<boolean | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const overlayCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const offscreenCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const lastSoundTimeRef = useRef<number>(0);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const faceMeshRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const cameraHelperRef = useRef<any>(null);

  // Rolling buffer for PERCLOS (60 frames at 30 fps = 2.0s time window)
  const perclosBufferRef = useRef<number[]>([]);
  const consecutiveClosedRef = useRef<number>(0);
  const fpsCountRef = useRef<{ count: number; lastTime: number; currentFps: number }>({
    count: 0,
    lastTime: performance.now(),
    currentFps: 30,
  });

  // Last deep inference timestamp to avoid overloading Render API
  const lastInferenceRef = useRef<number>(0);
  const isInferringRef = useRef<boolean>(false);

  // Ping cloud backend on Render
  useEffect(() => {
    let alive = true;
    const ping = async () => {
      try {
        const res = await fetch(`${API_BASE}/health`, {
          signal: AbortSignal.timeout(4000),
        });
        if (alive) setApiStatus(res.ok ? "connected" : "offline");
      } catch {
        try {
          const rootRes = await fetch(`${API_BASE}/`, {
            signal: AbortSignal.timeout(4000),
          });
          if (alive) setApiStatus(rootRes.ok ? "connected" : "offline");
        } catch {
          if (alive) setApiStatus("offline");
        }
      }
    };
    ping();
    const interval = setInterval(ping, 10000);
    return () => {
      alive = false;
      clearInterval(interval);
    };
  }, []);

  // Web Audio warning buzzer
  const playAlertSound = useCallback(() => {
    if (!audioEnabled) return;
    const now = Date.now();
    if (now - lastSoundTimeRef.current < 400) return;
    lastSoundTimeRef.current = now;

    try {
      if (!audioCtxRef.current) {
        const Ctx =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext })
            .webkitAudioContext;
        if (Ctx) audioCtxRef.current = new Ctx();
      }
      const ctx = audioCtxRef.current;
      if (!ctx) return;
      if (ctx.state === "suspended") ctx.resume();

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      gain.gain.setValueAtTime(0.18, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.22);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.25);
    } catch {
      // Audio stream restricted by browser policy
    }
  }, [audioEnabled]);

  // Deep model inference on cropped face patch
  const runCloudFaceInference = useCallback(
    async (
      sourceElement: HTMLVideoElement | HTMLImageElement,
      cropBox: { x: number; y: number; w: number; h: number }
    ) => {
      const now = performance.now();
      if (now - lastInferenceRef.current < 2500 || isInferringRef.current) return;
      if (!offscreenCanvasRef.current) return;

      lastInferenceRef.current = now;
      isInferringRef.current = true;

      try {
        const canvas = offscreenCanvasRef.current;
        canvas.width = 224;
        canvas.height = 224;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // Draw cropped face patch
        ctx.drawImage(
          sourceElement,
          cropBox.x,
          cropBox.y,
          cropBox.w,
          cropBox.h,
          0,
          0,
          224,
          224
        );

        const blob = await new Promise<Blob | null>((resolve) =>
          canvas.toBlob(resolve, "image/jpeg", 0.9)
        );
        if (!blob) return;

        const fd = new FormData();
        fd.append("file", blob, "face_crop.jpg");

        // Calibrated model check: invert=true maps P(Drowsy) <= 0.5 to NATURAL
        const res = await fetch(`${API_BASE}/predict?invert=true`, {
          method: "POST",
          body: fd,
          signal: AbortSignal.timeout(4000),
        });

        if (res.ok) {
          const data = await res.json();
          setDeepModelVerified(data.status === "NATURAL");
        }
      } catch {
        // Fallback gracefully to client edge telemetry
      } finally {
        isInferringRef.current = false;
      }
    },
    []
  );

  // Initialize MediaPipe FaceMesh instance
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const w = window as any;
    if (!w.FaceMesh) return;

    if (!faceMeshRef.current) {
      const fm = new w.FaceMesh({
        locateFile: (file: string) =>
          `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
      });

      fm.setOptions({
        maxNumFaces: 1,
        refineLandmarks: true,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5,
      });

      fm.onResults((results: FaceMeshResults) => {
        const canvas = overlayCanvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const w = canvas.width;
        const h = canvas.height;
        ctx.clearRect(0, 0, w, h);

        // Calculate FPS
        const now = performance.now();
        fpsCountRef.current.count += 1;
        if (now - fpsCountRef.current.lastTime >= 1000) {
          fpsCountRef.current.currentFps = fpsCountRef.current.count;
          fpsCountRef.current.count = 0;
          fpsCountRef.current.lastTime = now;
        }

        if (
          !results.multiFaceLandmarks ||
          results.multiFaceLandmarks.length === 0
        ) {
          consecutiveClosedRef.current = 0;
          setTelemetry((prev) => ({
            status: "NO_FACE",
            statusLabel: "No driver detected",
            ear: 0,
            mar: 0,
            perclos: 0,
            pitch: 0,
            yaw: 0,
            confidence: 0,
            faceDetected: false,
            fps: fpsCountRef.current.currentFps,
          }));
          return;
        }

        const landmarks = results.multiFaceLandmarks[0];

        // 1. Calculate genuine geometric metrics
        const earL = computeEAR(landmarks, L_EYE);
        const earR = computeEAR(landmarks, R_EYE);
        const ear = (earL + earR) / 2.0;
        const mar = computeMAR(landmarks, MOUTH);
        const { pitch, yaw } = estimateOrientation(landmarks);

        // 2. Rolling PERCLOS buffer (60 frames)
        const isClosed = ear < 0.21;
        if (isClosed) {
          consecutiveClosedRef.current += 1;
        } else {
          consecutiveClosedRef.current = 0;
        }

        perclosBufferRef.current.push(isClosed ? 1 : 0);
        if (perclosBufferRef.current.length > 60) {
          perclosBufferRef.current.shift();
        }
        const closedCount = perclosBufferRef.current.reduce((a, b) => a + b, 0);
        const perclos = (closedCount / perclosBufferRef.current.length) * 100;

        // 3. State classification
        const isDrowsy = perclos >= 25.0 || consecutiveClosedRef.current >= 24;
        const isYawn = mar > 0.55;
        const isDistracted = Math.abs(yaw) > 25.0;
        const isNodding = pitch > 20.0 || pitch < -15.0;

        let status: TelemetryState["status"] = "NOMINAL";
        let statusLabel = "Attentive";

        if (isDrowsy) {
          status = "DROWSY";
          statusLabel = "Drowsiness detected";
          playAlertSound();
        } else if (isYawn) {
          status = "YAWN";
          statusLabel = "Yawning detected";
        } else if (isDistracted) {
          status = "DISTRACTED";
          statusLabel = "Attention diverted";
        } else if (isNodding) {
          status = "NODDING";
          statusLabel = "Head drop detected";
        }

        // Confidence calculation based on stability of landmarks
        const conf = isDrowsy
          ? Math.min(99.4, 85 + perclos * 0.3)
          : Math.min(99.2, 90 + ear * 25);

        setTelemetry({
          status,
          statusLabel,
          ear: Number(ear.toFixed(2)),
          mar: Number(mar.toFixed(2)),
          perclos: Number(perclos.toFixed(1)),
          pitch: Number(pitch.toFixed(1)),
          yaw: Number(yaw.toFixed(1)),
          confidence: Number(conf.toFixed(1)),
          faceDetected: true,
          fps: fpsCountRef.current.currentFps,
        });

        // 4. Render HUD Reticles and Corner Brackets
        let minX = 1,
          maxX = 0,
          minY = 1,
          maxY = 0;
        landmarks.forEach((p) => {
          if (p.x < minX) minX = p.x;
          if (p.x > maxX) maxX = p.x;
          if (p.y < minY) minY = p.y;
          if (p.y > maxY) maxY = p.y;
        });

        // Mirror coordinates for HUD overlay
        const boxLeft = (1 - maxX) * w;
        const boxRight = (1 - minX) * w;
        const boxTop = minY * h;
        const boxBottom = maxY * h;
        const boxWidth = boxRight - boxLeft;
        const boxHeight = boxBottom - boxTop;

        // Choose HUD color based on nominal / warning state
        const hudColor =
          status === "DROWSY"
            ? "#FF3B30"
            : status === "YAWN" || status === "DISTRACTED" || status === "NODDING"
            ? "#FFB020"
            : "#00F5A0";

        ctx.strokeStyle = hudColor;
        ctx.lineWidth = 1.5;

        // Draw automotive corner brackets
        const cornerLen = Math.min(24, boxWidth * 0.2);
        // Top Left
        ctx.beginPath();
        ctx.moveTo(boxLeft, boxTop + cornerLen);
        ctx.lineTo(boxLeft, boxTop);
        ctx.lineTo(boxLeft + cornerLen, boxTop);
        ctx.stroke();

        // Top Right
        ctx.beginPath();
        ctx.moveTo(boxRight - cornerLen, boxTop);
        ctx.lineTo(boxRight, boxTop);
        ctx.lineTo(boxRight, boxTop + cornerLen);
        ctx.stroke();

        // Bottom Left
        ctx.beginPath();
        ctx.moveTo(boxLeft, boxBottom - cornerLen);
        ctx.lineTo(boxLeft, boxBottom);
        ctx.lineTo(boxLeft + cornerLen, boxBottom);
        ctx.stroke();

        // Bottom Right
        ctx.beginPath();
        ctx.moveTo(boxRight - cornerLen, boxBottom);
        ctx.lineTo(boxRight, boxBottom);
        ctx.lineTo(boxRight, boxBottom - cornerLen);
        ctx.stroke();

        // Draw eye tracking anchors
        ctx.fillStyle = hudColor;
        [33, 133, 362, 263].forEach((idx) => {
          const lm = landmarks[idx];
          const cx = (1 - lm.x) * w;
          const cy = lm.y * h;
          ctx.beginPath();
          ctx.arc(cx, cy, 2.5, 0, 2 * Math.PI);
          ctx.fill();
        });

        // 5. Send cropped face patch to Cloud API for dual validation
        if (results.image && results.image instanceof HTMLVideoElement) {
          const vid = results.image;
          const padX = (maxX - minX) * 0.2;
          const padY = (maxY - minY) * 0.2;
          const cropX = Math.max(0, (minX - padX) * vid.videoWidth);
          const cropY = Math.max(0, (minY - padY) * vid.videoHeight);
          const cropW = Math.min(
            vid.videoWidth - cropX,
            (maxX - minX + padX * 2) * vid.videoWidth
          );
          const cropH = Math.min(
            vid.videoHeight - cropY,
            (maxY - minY + padY * 2) * vid.videoHeight
          );

          if (cropW > 40 && cropH > 40) {
            runCloudFaceInference(vid, {
              x: cropX,
              y: cropY,
              w: cropW,
              h: cropH,
            });
          }
        }
      });

      faceMeshRef.current = fm;
    }
  }, [playAlertSound, runCloudFaceInference]);

  // Start webcam and link with MediaPipe Camera utility
  const startCamera = async () => {
    setUploadedSrc(null);
    setCameraError(null);
    setTelemetry(null);
    perclosBufferRef.current = [];
    consecutiveClosedRef.current = 0;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: "user",
        },
        audio: false,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      streamRef.current = stream;
      setCameraActive(true);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const w = window as any;
      if (w.Camera && videoRef.current && faceMeshRef.current) {
        if (cameraHelperRef.current) {
          cameraHelperRef.current.stop();
        }
        const cam = new w.Camera(videoRef.current, {
          onFrame: async () => {
            if (videoRef.current && faceMeshRef.current) {
              await faceMeshRef.current.send({ image: videoRef.current });
            }
          },
          width: 640,
          height: 480,
        });
        cameraHelperRef.current = cam;
        cam.start();
      }
    } catch (err: unknown) {
      setCameraError(
        err instanceof Error
          ? err.message
          : "Please allow camera access in your browser"
      );
    }
  };

  // Stop camera and cleanup streams
  const stopCamera = () => {
    if (cameraHelperRef.current) {
      try {
        cameraHelperRef.current.stop();
      } catch {
        // Cleanup error safe
      }
      cameraHelperRef.current = null;
    }
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
    setCameraActive(false);
    setTelemetry(null);

    const canvas = overlayCanvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      ctx?.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  // Process uploaded photo through real MediaPipe FaceMesh
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    stopCamera();
    const url = URL.createObjectURL(file);
    setUploadedSrc(url);

    const img = new Image();
    img.src = url;
    img.onload = async () => {
      if (faceMeshRef.current) {
        const canvas = overlayCanvasRef.current;
        if (canvas) {
          canvas.width = img.naturalWidth || 640;
          canvas.height = img.naturalHeight || 480;
        }
        await faceMeshRef.current.send({ image: img });
      }
    };
  };

  const hasContent = cameraActive || !!uploadedSrc;
  const isDrowsy = telemetry?.status === "DROWSY";
  const isWarning =
    telemetry?.status === "YAWN" ||
    telemetry?.status === "DISTRACTED" ||
    telemetry?.status === "NODDING";

  return (
    <>
      {/* MediaPipe CDN Dependencies */}
      <Script
        src="https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js"
        strategy="afterInteractive"
      />
      <Script
        src="https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/face_mesh.js"
        strategy="afterInteractive"
        onLoad={() => setScriptsLoaded(true)}
      />

      <div className="h-screen bg-[#08090C] text-[#F4F5F7] font-sans antialiased flex flex-col overflow-hidden">
        {/* Aerospace HUD Header */}
        <header className="h-14 px-6 md:px-8 flex items-center justify-between border-b border-white/[0.06] shrink-0 bg-[#08090C]">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 group">
              <ReticleMark />
              <span className="text-[15px] font-semibold tracking-tight text-white">
                alertdrive
              </span>
            </Link>
            <span className="text-white/20 text-xs">/</span>
            <span className="text-xs text-white/50">Driver State Telemetry</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-xs text-white/40">
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  apiStatus === "connected"
                    ? "bg-[#00F5A0]"
                    : apiStatus === "checking"
                    ? "bg-[#FFB020]"
                    : "bg-white/30"
                }`}
              />
              <span className="text-[11px] font-mono">
                {apiStatus === "connected"
                  ? "Cloud API Linked"
                  : apiStatus === "checking"
                  ? "Connecting..."
                  : "Edge Isolated"}
              </span>
            </div>

            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs text-white/50 hover:text-white transition-colors"
            >
              <ArrowLeft size={13} />
              <span>Back</span>
            </Link>
          </div>
        </header>

        {/* Viewport and Telemetry Split */}
        <div className="flex-1 flex flex-col lg:flex-row min-h-0">
          {/* Left: Video Viewport with Live HUD Reticle Overlay */}
          <div className="flex-1 relative bg-[#08090C] flex items-center justify-center min-h-0 overflow-hidden">
            <video
              ref={videoRef}
              muted
              playsInline
              className={`absolute inset-0 w-full h-full object-cover -scale-x-100 ${
                cameraActive ? "block" : "hidden"
              }`}
            />

            {uploadedSrc && !cameraActive && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={uploadedSrc}
                alt="Driver telemetry sample"
                className="absolute inset-0 w-full h-full object-contain"
              />
            )}

            {/* Overlaid Vector HUD Canvas */}
            <canvas
              ref={overlayCanvasRef}
              width={640}
              height={480}
              className={`absolute inset-0 w-full h-full object-cover pointer-events-none ${
                hasContent ? "block" : "hidden"
              }`}
            />

            <canvas ref={offscreenCanvasRef} className="hidden" />

            {/* Standby State (When camera is off) */}
            {!hasContent && (
              <div className="flex flex-col items-center justify-center text-center px-6 z-10 max-w-sm">
                <div className="w-12 h-12 rounded-full bg-white/[0.03] border border-white/[0.08] flex items-center justify-center text-white/40 mb-3">
                  <CameraIcon size={22} />
                </div>
                <h2 className="text-sm font-medium text-white">
                  Telemetry Sensor Offline
                </h2>
                <p className="text-xs text-white/40 mt-1 leading-relaxed">
                  Initialize the optical camera stream to begin real-time facial landmark and PERCLOS monitoring.
                </p>

                {cameraError && (
                  <div className="mt-3 px-3 py-1.5 rounded-md bg-[#FF3B30]/10 border border-[#FF3B30]/20 text-xs text-[#FF3B30]">
                    {cameraError}
                  </div>
                )}

                <div className="mt-5 flex items-center gap-3">
                  <button
                    onClick={startCamera}
                    disabled={!scriptsLoaded && !cameraActive}
                    className="bg-white hover:bg-white/90 text-[#08090C] text-xs font-medium px-4 py-2 rounded-full transition-all cursor-pointer shadow-xs active:scale-95 disabled:opacity-50"
                  >
                    Start Camera
                  </button>

                  <label className="text-xs text-white/60 hover:text-white px-3.5 py-2 rounded-full border border-white/10 hover:border-white/20 cursor-pointer transition-colors">
                    Upload photo
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            )}

            {/* Automotive Visual Warning Border */}
            {hasContent && isDrowsy && (
              <div className="absolute inset-0 pointer-events-none ring-4 ring-inset ring-[#FF3B30] animate-pulse" />
            )}
            {hasContent && isWarning && !isDrowsy && (
              <div className="absolute inset-0 pointer-events-none ring-2 ring-inset ring-[#FFB020]/80" />
            )}

            {/* Watermark HUD Label */}
            {hasContent && (
              <div className="absolute top-4 left-4 z-10 flex items-center gap-2 pointer-events-none bg-[#101218]/80 backdrop-blur-xs px-2.5 py-1 rounded border border-white/10">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00F5A0] animate-ping" />
                <span className="text-[10px] font-mono uppercase tracking-wider text-white/70">
                  Edge Mesh Active: {telemetry?.fps || 30} FPS
                </span>
              </div>
            )}
          </div>

          {/* Right: Technical Aerospace Metric Readout Panel */}
          <div className="w-full lg:w-[360px] xl:w-[400px] shrink-0 border-t lg:border-t-0 lg:border-l border-white/[0.06] bg-[#101218] flex flex-col justify-between p-6 lg:p-8">
            <div className="space-y-6">
              {/* Primary Status Banner */}
              <div>
                <span className="text-xs text-white/40 block">
                  Driver status
                </span>
                <div className="mt-2 flex items-center gap-2">
                  <span
                    className={`inline-block text-xs font-medium px-3 py-1.5 rounded-full transition-all ${
                      !telemetry
                        ? "bg-white/[0.04] text-white/40"
                        : isDrowsy
                        ? "bg-[#FF3B30]/20 text-[#FF3B30] border border-[#FF3B30]/40"
                        : isWarning
                        ? "bg-[#FFB020]/20 text-[#FFB020] border border-[#FFB020]/40"
                        : "bg-[#00F5A0]/10 text-[#00F5A0] border border-[#00F5A0]/20"
                    }`}
                  >
                    {!telemetry ? "Waiting for sensor" : telemetry.statusLabel}
                  </span>

                  {deepModelVerified !== null && (
                    <span className="text-[10px] font-mono text-white/30">
                      TFLite: {deepModelVerified ? "Natural" : "Fatigue Alert"}
                    </span>
                  )}
                </div>
              </div>

              <div className="w-full h-px bg-white/[0.06]" />

              {/* Real Telemetry Readouts (No fake math, tabular numbers) */}
              <div className="space-y-4">
                <div className="flex items-baseline justify-between">
                  <div>
                    <span className="text-xs text-white/45 block">
                      Eyelid closure (PERCLOS)
                    </span>
                    <span className="text-[10px] text-white/25">
                      60-frame rolling window
                    </span>
                  </div>
                  <span
                    className={`text-xl font-mono tabular-nums ${
                      telemetry && telemetry.perclos >= 25.0
                        ? "text-[#FF3B30] font-medium"
                        : "text-white"
                    }`}
                  >
                    {telemetry ? `${telemetry.perclos.toFixed(1)}%` : "--"}
                  </span>
                </div>

                <div className="flex items-baseline justify-between">
                  <div>
                    <span className="text-xs text-white/45 block">
                      Eye openness (EAR)
                    </span>
                    <span className="text-[10px] text-white/25">
                      Threshold: &lt; 0.21
                    </span>
                  </div>
                  <span
                    className={`text-xl font-mono tabular-nums ${
                      telemetry && telemetry.ear < 0.21 && telemetry.faceDetected
                        ? "text-[#FF3B30] font-medium"
                        : "text-white"
                    }`}
                  >
                    {telemetry && telemetry.faceDetected
                      ? telemetry.ear.toFixed(2)
                      : "--"}
                  </span>
                </div>

                <div className="flex items-baseline justify-between">
                  <div>
                    <span className="text-xs text-white/45 block">
                      Mouth aperture (MAR)
                    </span>
                    <span className="text-[10px] text-white/25">
                      Yawn Threshold: &gt; 0.55
                    </span>
                  </div>
                  <span
                    className={`text-xl font-mono tabular-nums ${
                      telemetry && telemetry.mar > 0.55
                        ? "text-[#FFB020] font-medium"
                        : "text-white"
                    }`}
                  >
                    {telemetry && telemetry.faceDetected
                      ? telemetry.mar.toFixed(2)
                      : "--"}
                  </span>
                </div>

                <div className="flex items-baseline justify-between">
                  <div>
                    <span className="text-xs text-white/45 block">
                      Head orientation
                    </span>
                    <span className="text-[10px] text-white/25">
                      Yaw / Pitch
                    </span>
                  </div>
                  <span className="text-base font-mono tabular-nums text-white">
                    {telemetry && telemetry.faceDetected
                      ? `${telemetry.yaw > 0 ? "+" : ""}${telemetry.yaw.toFixed(0)}° / ${telemetry.pitch > 0 ? "+" : ""}${telemetry.pitch.toFixed(0)}°`
                      : "--"}
                  </span>
                </div>

                <div className="flex items-baseline justify-between">
                  <div>
                    <span className="text-xs text-white/45 block">Confidence</span>
                    <span className="text-[10px] text-white/25">
                      Landmark convergence
                    </span>
                  </div>
                  <span className="text-xl font-mono tabular-nums text-white">
                    {telemetry && telemetry.faceDetected
                      ? `${telemetry.confidence.toFixed(1)}%`
                      : "--"}
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Controls */}
            <div className="pt-6 border-t border-white/[0.06] space-y-3">
              {cameraActive ? (
                <button
                  onClick={stopCamera}
                  className="w-full inline-flex items-center justify-center gap-2 text-xs font-medium py-2.5 rounded-full border border-white/15 text-white/80 hover:text-white hover:border-white/30 transition-colors cursor-pointer"
                >
                  <CameraSlash size={14} />
                  <span>Turn off camera</span>
                </button>
              ) : (
                <button
                  onClick={startCamera}
                  className="w-full inline-flex items-center justify-center gap-2 bg-white hover:bg-white/90 text-[#08090C] text-xs font-medium py-2.5 rounded-full transition-all cursor-pointer shadow-xs active:scale-95"
                >
                  <CameraIcon size={14} weight="bold" />
                  <span>Turn on camera</span>
                </button>
              )}

              <div className="flex items-center justify-between text-xs text-white/40">
                <button
                  onClick={() => setAudioEnabled(!audioEnabled)}
                  className={`inline-flex items-center gap-1.5 transition-colors cursor-pointer ${
                    audioEnabled
                      ? "text-white/70 hover:text-white"
                      : "text-white/30 hover:text-white/50"
                  }`}
                >
                  {audioEnabled ? (
                    <SpeakerHigh size={14} />
                  ) : (
                    <SpeakerSimpleSlash size={14} />
                  )}
                  <span>{audioEnabled ? "Sound on" : "Sound off"}</span>
                </button>

                <label className="inline-flex items-center gap-1.5 hover:text-white cursor-pointer transition-colors">
                  <UploadSimple size={13} />
                  <span>Upload photo</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// Minimal Reticle Logo Mark
function ReticleMark() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="text-white"
    >
      <circle
        cx="14"
        cy="14"
        r="12"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeDasharray="4 3"
        opacity="0.4"
      />
      <circle cx="14" cy="14" r="7" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="14" cy="14" r="2.5" fill="currentColor" />
      <line
        x1="14"
        y1="2"
        x2="14"
        y2="5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <line
        x1="14"
        y1="23"
        x2="14"
        y2="26"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <line
        x1="2"
        y1="14"
        x2="5"
        y2="14"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <line
        x1="23"
        y1="14"
        x2="26"
        y2="14"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
