"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import type { Coin } from "../types";

type MarketSceneProps = {
  coins: Coin[];
};

type BubbleObject = {
  basePosition: THREE.Vector3;
  group: THREE.Group;
  haloMaterial: THREE.SpriteMaterial;
  radius: number;
  shell: THREE.Mesh;
  wire: THREE.Mesh;
};

const POSITIVE_START = new THREE.Color("#14532d");
const POSITIVE_END = new THREE.Color("#22c55e");
const NEGATIVE_START = new THREE.Color("#7f1d1d");
const NEGATIVE_END = new THREE.Color("#fb7185");
const NEUTRAL_COLOR = new THREE.Color("#71717a");

function getBubbleColor(change: number) {
  if (Math.abs(change) < 0.05) {
    return NEUTRAL_COLOR.clone();
  }

  const amount = Math.min(Math.abs(change) / 6, 1);
  const start = change > 0 ? POSITIVE_START : NEGATIVE_START;
  const end = change > 0 ? POSITIVE_END : NEGATIVE_END;

  return start.clone().lerp(end, amount);
}

function getBubbleRadius(change: number, maxMove: number) {
  if (maxMove < 0.05) {
    return 0.62;
  }

  const normalized = Math.abs(change) / maxMove;
  return 0.48 + normalized * 0.32;
}

function disposeMaterial(material: THREE.Material | THREE.Material[]) {
  if (Array.isArray(material)) {
    material.forEach((item) => item.dispose());
    return;
  }

  material.dispose();
}

function createGlowTexture(color: THREE.Color) {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;

  const context = canvas.getContext("2d");

  if (context) {
    const centerColor = `rgba(${Math.round(color.r * 255)}, ${Math.round(
      color.g * 255,
    )}, ${Math.round(color.b * 255)}, 0.52)`;
    const edgeColor = `rgba(${Math.round(color.r * 255)}, ${Math.round(
      color.g * 255,
    )}, ${Math.round(color.b * 255)}, 0)`;
    const gradient = context.createRadialGradient(128, 128, 0, 128, 128, 128);
    gradient.addColorStop(0, centerColor);
    gradient.addColorStop(0.44, centerColor);
    gradient.addColorStop(1, edgeColor);

    context.fillStyle = gradient;
    context.fillRect(0, 0, 256, 256);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;

  return texture;
}

function createLabelTexture(symbol: string) {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 128;

  const context = canvas.getContext("2d");

  if (context) {
    context.clearRect(0, 0, 256, 128);
    context.font = "800 54px Arial";
    context.fillStyle = "#ffffff";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.shadowBlur = 16;
    context.shadowColor = "rgba(0,0,0,0.85)";
    context.fillText(symbol, 128, 66);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;

  return texture;
}

function createLayoutPosition(index: number, compact: boolean) {
  if (compact) {
    const mobilePositions = [
      new THREE.Vector3(-0.58, 0.48, 0.08),
      new THREE.Vector3(0.56, 0.45, -0.04),
      new THREE.Vector3(-0.44, -0.42, -0.02),
      new THREE.Vector3(0.62, -0.38, 0.08),
    ];

    return mobilePositions[index] ?? new THREE.Vector3(0, 0, 0);
  }

  const desktopPositions = [
    new THREE.Vector3(-1.55, 0.05, 0.16),
    new THREE.Vector3(-0.48, 0.34, -0.08),
    new THREE.Vector3(0.66, -0.05, 0.1),
    new THREE.Vector3(1.58, 0.28, -0.06),
  ];

  return desktopPositions[index] ?? new THREE.Vector3(0, 0, 0);
}

export default function MarketScene({ coins }: MarketSceneProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;

    if (!container || coins.length === 0) {
      return;
    }

    const sceneContainer = container;
    const width = container.clientWidth || 900;
    const height = container.clientHeight || 300;
    const maxMove = Math.max(...coins.map((coin) => Math.abs(coin.change)));
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(37, width / height, 0.1, 100);
    camera.position.set(0, 0, 4.5);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
    });
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.7));
    renderer.setSize(width, height);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.domElement.style.display = "block";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.width = "100%";
    container.appendChild(renderer.domElement);

    const root = new THREE.Group();
    scene.add(root);

    const ambientLight = new THREE.AmbientLight("#ffffff", 1.45);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight("#ffffff", 2.8);
    keyLight.position.set(-1.5, 2.4, 3.8);
    scene.add(keyLight);

    const fillLight = new THREE.PointLight("#38bdf8", 6.2, 7);
    fillLight.position.set(2.4, -1.2, 2.2);
    scene.add(fillLight);

    const labelTextures: THREE.CanvasTexture[] = [];
    const glowTextures: THREE.CanvasTexture[] = [];
    const bubbles: BubbleObject[] = coins.map((coin, index) => {
      const radius = getBubbleRadius(coin.change, maxMove);
      const color = getBubbleColor(coin.change);
      const basePosition = createLayoutPosition(index, false);
      const group = new THREE.Group();
      group.position.copy(basePosition);

      const haloTexture = createGlowTexture(color);
      glowTextures.push(haloTexture);
      const haloMaterial = new THREE.SpriteMaterial({
        blending: THREE.AdditiveBlending,
        color: "#ffffff",
        depthWrite: false,
        map: haloTexture,
        opacity: 0.52,
        transparent: true,
      });
      const halo = new THREE.Sprite(haloMaterial);
      halo.scale.set(radius * 3.05, radius * 3.05, 1);
      halo.position.z = -radius * 0.22;
      group.add(halo);

      const shellMaterial = new THREE.MeshPhysicalMaterial({
        clearcoat: 0.95,
        clearcoatRoughness: 0.16,
        color,
        emissive: color,
        emissiveIntensity: 0.18,
        metalness: 0.06,
        opacity: 0.82,
        roughness: 0.2,
        transparent: true,
      });
      const shell = new THREE.Mesh(
        new THREE.SphereGeometry(radius, 56, 36),
        shellMaterial,
      );
      group.add(shell);

      const wire = new THREE.Mesh(
        new THREE.SphereGeometry(radius * 1.012, 28, 18),
        new THREE.MeshBasicMaterial({
          color: "#ffffff",
          opacity: 0.12,
          transparent: true,
          wireframe: true,
        }),
      );
      group.add(wire);

      const highlight = new THREE.Mesh(
        new THREE.SphereGeometry(radius * 0.18, 24, 16),
        new THREE.MeshBasicMaterial({
          color: "#ffffff",
          opacity: 0.34,
          transparent: true,
        }),
      );
      highlight.position.set(-radius * 0.32, radius * 0.36, radius * 0.74);
      group.add(highlight);

      const labelTexture = createLabelTexture(coin.symbol);
      labelTextures.push(labelTexture);
      const label = new THREE.Sprite(
        new THREE.SpriteMaterial({
          depthTest: false,
          depthWrite: false,
          map: labelTexture,
          transparent: true,
        }),
      );
      label.scale.set(radius * 1.18, radius * 0.58, 1);
      label.position.z = radius * 1.03;
      group.add(label);

      root.add(group);

      return {
        basePosition,
        group,
        haloMaterial,
        radius,
        shell,
        wire,
      };
    });

    const pointer = new THREE.Vector2(0, 0);
    const targetPointer = new THREE.Vector2(0, 0);

    function handlePointerMove(event: PointerEvent) {
      const rect = sceneContainer.getBoundingClientRect();
      targetPointer.x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
      targetPointer.y = -(((event.clientY - rect.top) / rect.height - 0.5) * 2);
    }

    function handlePointerLeave() {
      targetPointer.set(0, 0);
    }

    container.addEventListener("pointermove", handlePointerMove);
    container.addEventListener("pointerleave", handlePointerLeave);

    function resizeScene(nextWidth: number, nextHeight: number) {
      const compact = nextWidth < 560;

      renderer.setSize(nextWidth, nextHeight);
      camera.aspect = nextWidth / nextHeight;
      camera.position.set(0, compact ? 0.02 : 0, compact ? 4.55 : 4.5);
      camera.updateProjectionMatrix();
      root.scale.setScalar(compact ? 0.86 : 1);

      bubbles.forEach((bubble, index) => {
        bubble.basePosition = createLayoutPosition(index, compact);
        bubble.group.position.copy(bubble.basePosition);
      });
    }

    const resizeObserver = new ResizeObserver(([entry]) => {
      const nextWidth = entry.contentRect.width;
      const nextHeight = entry.contentRect.height;

      if (nextWidth > 0 && nextHeight > 0) {
        resizeScene(nextWidth, nextHeight);
      }
    });
    resizeObserver.observe(container);

    let animationFrameId = 0;

    function animate(time: number) {
      const seconds = time / 1000;

      pointer.lerp(targetPointer, 0.055);
      root.rotation.y = pointer.x * 0.16 + Math.sin(seconds * 0.16) * 0.03;
      root.rotation.x = -pointer.y * 0.08 + Math.cos(seconds * 0.14) * 0.018;

      bubbles.forEach((bubble, index) => {
        const pulse = 1 + Math.sin(seconds * 1.25 + index * 0.8) * 0.025;
        const driftX = Math.sin(seconds * 0.64 + index * 1.7) * 0.035;
        const driftY = Math.cos(seconds * 0.58 + index * 1.2) * 0.035;

        bubble.group.position.set(
          bubble.basePosition.x + driftX,
          bubble.basePosition.y + driftY,
          bubble.basePosition.z,
        );
        bubble.group.scale.setScalar(pulse);
        bubble.shell.rotation.y += 0.004 + index * 0.0008;
        bubble.shell.rotation.x += 0.002;
        bubble.wire.rotation.y -= 0.003;
        bubble.wire.rotation.x += 0.002;
        bubble.haloMaterial.opacity = 0.44 + Math.sin(seconds * 1.3 + index) * 0.08;
      });

      renderer.render(scene, camera);
      animationFrameId = window.requestAnimationFrame(animate);
    }

    animate(0);

    return () => {
      window.cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      container.removeEventListener("pointermove", handlePointerMove);
      container.removeEventListener("pointerleave", handlePointerLeave);

      scene.traverse((object) => {
        if (
          object instanceof THREE.Mesh ||
          object instanceof THREE.Line ||
          object instanceof THREE.Points
        ) {
          object.geometry.dispose();
          disposeMaterial(object.material);
        }

        if (object instanceof THREE.Sprite) {
          disposeMaterial(object.material);
        }
      });

      labelTextures.forEach((texture) => texture.dispose());
      glowTextures.forEach((texture) => texture.dispose());
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [coins]);

  if (coins.length === 0) {
    return null;
  }

  return (
    <div className="relative mb-8 overflow-hidden rounded-lg border border-zinc-800 bg-zinc-950 shadow-xl shadow-black/25">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-14 bg-gradient-to-b from-zinc-950 to-transparent" />
      <div ref={containerRef} className="h-72 w-full sm:h-80" />
    </div>
  );
}
