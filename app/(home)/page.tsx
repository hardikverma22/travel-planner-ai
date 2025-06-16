"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useTransform, animate, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Plane } from "lucide-react";
import { InteractiveHoverButton } from "@/components/magicui/interactive-hover-button";
import TravelHero from "@/components/home/TravelHero";
import { AnimatedListDemo } from "@/components/animated-list";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/useMediaQuery";

export default function Home() {
  const [step, setStep] = useState(0); // 0: old logo, 1: arc+plane, 2: rutugo logo, 3: text
  const progress = useMotionValue(0);
  const [showSecond, setShowSecond] = useState(false);
  const isMobile = useMediaQuery('(max-width: 768px)');


  const arcCenterX = 490;
  const arcCenterY = 390;
  const arcRadius = 380;

  const cx = useTransform(progress, t => arcCenterX + arcRadius * Math.cos(Math.PI * (1 - t)));
  const cy = useTransform(progress, t => arcCenterY - arcRadius * Math.sin(Math.PI * (1 - t)));

  const angle = useTransform(progress, t => {
    const theta = Math.PI + Math.PI * t;
    const dx = -arcRadius * Math.PI * Math.sin(theta);
    const dy = arcRadius * Math.PI * Math.cos(theta);
    return (Math.atan2(dy, dx) * 180) / Math.PI + 40;
  });

  // Animation sequence control
  useEffect(() => {
    // Step 0: Show old logo, after 700ms go to step 1
    if (step === 0) {
      const t = setTimeout(() => setStep(1), 700);
      return () => clearTimeout(t);
    }
    // Step 1: Animate arc+plane, after 2.5s go to step 2
    if (step === 1) {
      const controls = animate(progress, 1, {
        duration: 2,
        ease: "easeInOut",
        bounceStiffness: 100,
        onComplete: () => setStep(2),
      });
      return () => controls.stop();
    }
    // Step 2: Show Rutugo logo, after 600ms go to step 3
    if (step === 2) {
      const t = setTimeout(() => setStep(3), 600);
      return () => clearTimeout(t);
    }
    if (step === 3) {
      // Wait for the hero's entrance animation to finish, then show second article
      const t = setTimeout(() => setShowSecond(true), 1200); // adjust timing as needed
      return () => clearTimeout(t);
    }
  }, [step]);

  const arcPath = "M 120 400 A 380 380 0 0 1 880 400";

  return (
    <motion.section
      className={`flex flex-col md:flex-row w-full h-screen gap-5 md:gap-1 transition-all duration-700 ${showSecond ? 'md:justify-between' : 'md:justify-center'
        }`}
      layout
    >
      <motion.article
        layout
        className={cn(`relative flex flex-col items-center justify-center bg-gradient-to-br
          dark:from-[#181A20] dark:via-[#101114] dark:to-[#181A20] overflow-hidden`, {
          'md:w-[100vw]': !showSecond,
          'md:w-[75vw]': showSecond,
        })}
        // {`relative flex flex-col items-center justify-center bg-gradient-to-br
        //  dark:from-[#181A20] dark:via-[#101114] dark:to-[#181A20] overflow-hidden
        //  ${showSecond ? 'w-[75vw]' : 'w-[100vw]'}`}
        style={{
          transition: "width 0.7s cubic-bezier(0.4,0,0.2,1)",
        }}
      >

        {/* Arc and logos */}
        <svg
          viewBox="0 0 1000 500"
          className="pointer-events-none absolute top-0 left-0 w-full h-full"
        >
          {/* Dotted Arc - fade in with plane */}
          <motion.path
            d={arcPath}
            stroke="#444"
            strokeWidth="2"
            fill="none"
            strokeDasharray="8 10"
            initial={{ opacity: 0 }}
            animate={{ opacity: step >= 1 ? 1 : 0 }}
            transition={{ duration: 0.5 }}
          />
          {/* Old Logo (left) - fade in */}
          <motion.image
            href="/logo.png"
            x="45"
            y="350"
            width="200"
            height="200"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: step >= 0 ? 1 : 0, scale: step >= 0 ? 1 : 0.8 }}
            transition={{ duration: 0.6 }}
          />
          {/* New Logo (right) - fade in after plane animation */}
          <motion.image
            href="/rutugo-logo.png"
            x="775"
            y="350"
            width="200"
            height="200"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: step >= 2 ? 1 : 0, scale: step >= 2 ? 1 : 0.8 }}
            transition={{ duration: 0.6 }}
          />
          {/* Animated Plane Icon moving along the arc - only show during step 1 and after */}
          {step >= 1 && (
            <motion.g
              style={{
                translateX: cx,
                translateY: cy,
                rotate: angle,
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Plane className="text-transparent fill-blue-500" height={24} width={24} />
            </motion.g>
          )}
        </svg>

        {/* Main Content below the arc */}

        <motion.div
          className="h-2/3 md:w-2/3 w-full relative z-10 flex flex-col items-center justify-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: step >= 3 ? 1 : 0, y: step >= 3 ? 0 : 30 }}
          transition={{ duration: 0.7 }}
        >
          <div className="max-h-[70vh] max-w-[70vw] w-full h-full flex items-center justify-center mx-auto">
            <TravelHero />
          </div>
        </motion.div>
        <motion.div
          className="hidden md:flex absolute bottom-0 z-10 w-full h-full px-6 py-16 flex-col items-center justify-end -mt-10 p-5"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: step >= 3 ? 1 : 0, y: step >= 3 ? 0 : 30 }}
          transition={{ duration: 0.7 }}
        >
          <Link href="https://rutugo.com">
            <InteractiveHoverButton className="border-2 border-blue-500 shadow-xl">
              Plan Smarter on Rutugo
            </InteractiveHoverButton>
          </Link>
        </motion.div>
      </motion.article>
      <motion.article className="flex justify-center items-center">
        <motion.div
          className="md:hidden flex "
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: step >= 3 ? 1 : 0, y: step >= 3 ? 0 : 30 }}
          transition={{ duration: 0.7 }}
        >
          <Link href="https://rutugo.com">
            <InteractiveHoverButton className="border-2 border-blue-500 shadow-xl">
              Plan Smarter on Rutugo
            </InteractiveHoverButton>
          </Link>
        </motion.div>
      </motion.article>
      <AnimatePresence>
        {showSecond && (
          <motion.article
            layout
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ duration: 0.7 }}
            className="flex justify-center items-center md:w-[25vw] w-full h-full flex-col"
          >
            <h2 className="text-2xl font-bold">What's new in Rutugo?</h2>
            <AnimatedListDemo />
          </motion.article>
        )}
      </AnimatePresence>
    </motion.section>

  );
}
