/**
 * One apex zone per side on the 3D model (A-RA / A-LA). Posterior apex
 * findings (COMPASS 10p / 5p) must show there, not on a hidden zone.
 */
import { describe, it, expect } from "vitest";
import { usePatientStore } from "@/store/patientStore";
import { emptyLesion } from "@/types/lesion";

describe("apex zone on the 3D model", () => {
  it("has exactly one apex zone per side", () => {
    usePatientStore.getState().newCase();
    const ids = usePatientStore.getState().threeZones.map((z) => z.id);
    expect(ids.filter((id) => id.includes("A-") && id.endsWith("A"))).toEqual(["A-RA", "A-LA"]);
    expect(ids).not.toContain("P-RA");
    expect(ids).not.toContain("P-LA");
  });

  it("shows a posterior apex biopsy on the right apex zone", () => {
    const st = usePatientStore.getState();
    st.newCase();
    st.updateClinicalForm({ psa: 8, vol: 40, gg: 4 });
    const before = usePatientStore.getState().threeZones.find((z) => z.id === "A-RA")!.cancer;
    usePatientStore.getState().updateLesionRows([
      { ...emptyLesion("apex-bx"), source: "Bx", side: "R", level: "Apex", zone: "Posterolateral", score: "4", corePct: 60 },
    ]);
    const after = usePatientStore.getState().threeZones.find((z) => z.id === "A-RA")!.cancer;
    expect(after).toBeGreaterThan(before);
    expect(after).toBeGreaterThan(0.5);
  });
});
