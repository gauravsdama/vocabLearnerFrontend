import whiteCelebrate from "../assets/mascot/white/white_celebrate.webp";
import whiteHappyBright from "../assets/mascot/white/white_happy_bright.webp";
import whiteHappyExcited from "../assets/mascot/white/white_happy_excited.webp";
import whiteHappySit from "../assets/mascot/white/white_happy_sit.webp";
import whiteHappySoft from "../assets/mascot/white/white_happy_soft.webp";
import whiteHappyWarm from "../assets/mascot/white/white_happy_warm.webp";
import whitePeekLeft from "../assets/mascot/white/white_peek_left.webp";
import whiteSadDejected from "../assets/mascot/white/white_sad_dejected.webp";

export const MASCOT_VARIANTS = ["white", "calico", "ginger", "black"] as const;

export type MascotVariant = (typeof MASCOT_VARIANTS)[number];

const whiteCatalog = {
  celebrate: whiteCelebrate,
  peek_left: whitePeekLeft,
  happy_sit: whiteHappySit,
  happy_soft: whiteHappySoft,
  happy_warm: whiteHappyWarm,
  happy_bright: whiteHappyBright,
  happy_excited: whiteHappyExcited,
  sad_dejected: whiteSadDejected,
} as const;

export type MascotPose = keyof typeof whiteCatalog;

const FALLBACK_VARIANT: MascotVariant = "white";

const mascotCatalog: Record<MascotVariant, Partial<Record<MascotPose, string>>> = {
  white: whiteCatalog,
  calico: {},
  ginger: {},
  black: {},
};

// The planned white "read" pose is not in the promoted final bundle yet.
// Keep the brand routed through one constant so it can be swapped cleanly later.
export const BRAND_MASCOT_POSE: MascotPose = "happy_sit";

export function resolveMascotAsset(requestedVariant: MascotVariant, pose: MascotPose) {
  const requestedSrc = mascotCatalog[requestedVariant][pose];
  if (requestedSrc) {
    return {
      actualVariant: requestedVariant,
      src: requestedSrc,
    };
  }

  return {
    actualVariant: FALLBACK_VARIANT,
    src: whiteCatalog[pose],
  };
}
