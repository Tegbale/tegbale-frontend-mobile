import { api } from './api';

export type Classroom = {
  id: string;
  name: string;
  _count?: { students: number; teachers: number };
};

export type ClassroomStudent = {
  id: string;
  firstName: string;
  lastName: string;
  gender: string | null;
  classroom: { id: string; name: string } | null;
};

export type ClassroomTeacher = {
  id: string;
  user: { id: string; firstName: string; lastName: string };
};

type ClassroomsResponse = { classrooms: Classroom[]; total: number };
type StudentsResponse = { students: ClassroomStudent[]; total: number };
type ClassroomDetailResponse = Classroom & { teachers: ClassroomTeacher[]; students: ClassroomStudent[] };

export async function listClassrooms(): Promise<ClassroomsResponse> {
  return api.get<ClassroomsResponse>('/v1/classrooms');
}

export async function listClassroomStudents(classroomId: string): Promise<StudentsResponse> {
  return api.get<StudentsResponse>(`/v1/students?classroomId=${classroomId}&limit=100`);
}

export async function getClassroomTeachers(classroomId: string): Promise<ClassroomTeacher[]> {
  const data = await api.get<ClassroomDetailResponse>(`/v1/classrooms/${classroomId}`);
  return data.teachers ?? [];
}
