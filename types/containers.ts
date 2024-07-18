export enum Priority {
  High = 1,
  Medium = 2,
  Low = 3,
}

export enum Status {
  InTransit = "in_transit",
  Pending = "pending",
  Arrived = "arrived",
}

export type Container = {
  id: string;
  origin: string;
  destination: string;
  supply_type: string;
  expected_arrival_date: string;
  status: Status;
  priority: Priority;
  verified: boolean;
}
