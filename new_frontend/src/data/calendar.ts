export type Stage = { name: string; from: [number, number]; to: [number, number] };
export type CropPlan = { id: string; crop: string; season: "Rabi" | "Kharif"; stages: Stage[] };

// months are 1-based [month, day]
export const CALENDAR_TEMPLATES: CropPlan[] = [
  { id: "wheat", crop: "Wheat", season: "Rabi", stages: [
    { name: "Sowing", from: [11, 1], to: [11, 15] },
    { name: "Irrigation", from: [12, 1], to: [2, 28] },
    { name: "Fertilizer Application", from: [1, 1], to: [1, 31] },
    { name: "Harvesting", from: [4, 1], to: [4, 20] },
  ] },
  { id: "rice", crop: "Rice", season: "Kharif", stages: [
    { name: "Sowing", from: [6, 1], to: [7, 15] },
    { name: "Transplanting", from: [7, 1], to: [7, 31] },
    { name: "Irrigation & Top Dressing", from: [8, 1], to: [9, 30] },
    { name: "Harvesting", from: [10, 1], to: [11, 30] },
  ] },
  { id: "soybean", crop: "Soybean", season: "Kharif", stages: [
    { name: "Sowing", from: [6, 20], to: [7, 10] },
    { name: "Weeding", from: [7, 15], to: [7, 31] },
    { name: "Pest Watch (Girdle Beetle)", from: [8, 1], to: [8, 31] },
    { name: "Harvesting", from: [10, 1], to: [10, 20] },
  ] },
  { id: "chickpea", crop: "Chickpea", season: "Rabi", stages: [
    { name: "Sowing", from: [10, 15], to: [11, 10] },
    { name: "Irrigation", from: [12, 1], to: [12, 31] },
    { name: "Pod Borer Watch", from: [1, 15], to: [2, 10] },
    { name: "Harvesting", from: [2, 20], to: [3, 20] },
  ] },
  { id: "mustard", crop: "Mustard", season: "Rabi", stages: [
    { name: "Sowing", from: [10, 1], to: [10, 25] },
    { name: "Irrigation", from: [11, 15], to: [12, 31] },
    { name: "Aphid Watch", from: [12, 15], to: [1, 31] },
    { name: "Harvesting", from: [2, 20], to: [3, 15] },
  ] },
  { id: "cotton", crop: "Cotton", season: "Kharif", stages: [
    { name: "Sowing", from: [5, 15], to: [6, 30] },
    { name: "Thinning & Weeding", from: [7, 1], to: [7, 31] },
    { name: "Bollworm Watch", from: [8, 1], to: [9, 30] },
    { name: "Picking", from: [10, 15], to: [12, 31] },
  ] },
];

export type StageStatus = "Completed" | "Active" | "Upcoming" | "Pending";

/** Resolve the current crop cycle and work out each stage's status for `today`. */
export function stageTimeline(plan: CropPlan, today = new Date()) {
  const year = today.getFullYear();
  const month = today.getMonth() + 1;
  // Rabi cycles start in October; Kharif cycles start in May
  const startMonth = plan.season === "Rabi" ? 10 : 5;
  const cycleYear = month >= startMonth ? year : year - 1;
  const dateFor = ([m, d]: [number, number]) =>
    new Date(plan.season === "Rabi" && m < startMonth ? cycleYear + 1 : cycleYear, m - 1, d);

  let upcomingAssigned = false;
  return plan.stages.map((stage) => {
    const from = dateFor(stage.from);
    const to = dateFor(stage.to);
    to.setHours(23, 59, 59);
    let status: StageStatus;
    if (today > to) status = "Completed";
    else if (today >= from) status = "Active";
    else if (!upcomingAssigned) {
      status = "Upcoming";
      upcomingAssigned = true;
    } else status = "Pending";
    return { ...stage, fromDate: from, toDate: to, status };
  });
}
