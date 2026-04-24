export type FieldStage = 'Planted' | 'Growing' | 'Ready' | 'Harvested';
export type FieldStatus = 'Active' | 'AtRisk' | 'Completed';

export interface AuthResponse {
  token: string;
  UserName: string;
  FirstName: string;
  SecondName: string;
  Email: string;
  PhoneNumber: string;
  role: 'Admin' | 'FieldAgent';
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface CreateFieldRequest {
  name: string;
  cropType: string;
  plantingDate: string;
  currentStage: FieldStage;
}

export interface UpdateFieldRequest {
  name: string;
  cropType: string;
  plantingDate: string;
  currentStage: FieldStage;
}

export interface AgentFieldUpdateRequest {
  stage: FieldStage;
  notes: string;
}

export interface FieldUpdateItem {
  id: string;
  stage: FieldStage;
  notes: string;
  createdAt: string;
}

export interface AssignedField {
  id: string;
  name: string;
  cropType: string;
  plantingDate: string;
  currentStage: FieldStage;
  status: FieldStatus;
  lastUpdatedAt?: string;
  updates?: FieldUpdateItem[];
}

export interface AdminField extends AssignedField {
  assignedAgentId?: string;
  assignedAgent?: {
    id: string;
    firstName: string;
    secondName: string;
    email: string;
  } | null;
}

export interface FieldAgent {
  id: string;
  userName: string;
  firstName: string;
  secondName: string;
  email: string;
  phoneNumber: string;
}

export interface FieldUpdateHistoryItem {
  id: string;
  fieldId: string;
  fieldName: string;
  stage: FieldStage;
  notes: string;
  createdAt: string;
}
