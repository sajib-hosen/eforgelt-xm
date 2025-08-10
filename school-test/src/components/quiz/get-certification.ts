export const getCertification = (step: 1 | 2 | 3, percentage: number) => {
  if (step === 1) {
    if (percentage < 25)
      return { status: "fail", certifiedLevel: null, nextStep: null };
    if (percentage < 50)
      return { status: "pass", certifiedLevel: "A1", nextStep: null };
    if (percentage < 75)
      return { status: "pass", certifiedLevel: "A2", nextStep: null };
    return { status: "pass", certifiedLevel: "A2", nextStep: 2 };
  } else if (step === 2) {
    if (percentage < 25)
      return { status: "pass", certifiedLevel: "A2", nextStep: null };
    if (percentage < 50)
      return { status: "pass", certifiedLevel: "B1", nextStep: null };
    if (percentage < 75)
      return { status: "pass", certifiedLevel: "B2", nextStep: null };
    return { status: "pass", certifiedLevel: "B2", nextStep: 3 };
  } else if (step === 3) {
    if (percentage < 25)
      return { status: "pass", certifiedLevel: "B2", nextStep: null };
    if (percentage < 50)
      return { status: "pass", certifiedLevel: "C1", nextStep: null };
    return { status: "pass", certifiedLevel: "C2", nextStep: null };
  }
  return { status: "fail", certifiedLevel: null, nextStep: null };
};
