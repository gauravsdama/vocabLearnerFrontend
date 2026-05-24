import blackSadSoft from "../../../../assets/vocabcat/generated/black/black_sad_soft.png";
import calicoHappyBright from "../../../../assets/vocabcat/generated/calico/calico_happy_bright.png";
import gingerRead from "../../../../assets/vocabcat/generated/ginger/ginger_read.png";

export const marketingReadCat = {
  src: gingerRead,
  alt: "A ginger cat reading an open book.",
};

export const marketingProblemCats = [
  {
    src: gingerRead,
    alt: "A ginger cat reading with focused attention.",
  },
  {
    src: blackSadSoft,
    alt: "A soft black cat with a sympathetic, slightly sad expression.",
  },
  {
    src: calicoHappyBright,
    alt: "A bright calico cat bringing energy to progress tracking.",
  },
] as const;
