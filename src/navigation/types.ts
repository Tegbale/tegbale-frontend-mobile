export type RootStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  SelectAccountType: undefined;
  TeacherLogin: undefined;
  ParentLogin: undefined;
  ParentApp: undefined;
  TeacherApp: undefined;
  ClassroomDetail: { classroom: ClassroomData };
  ViewWard: { student: StudentData };
  ViewStudent: { student: StudentData };
  CreateMessage: undefined;
  Chat: { contact: ContactData };
  Profile: undefined;
  Settings: undefined;
  Events: undefined;
};

export type ClassroomData = {
  id: string;
  name: string;
  studentCount: number;
};

export type StudentData = {
  id: string;
  name: string;
  firstName: string;
  classroom: string;
  classroomId?: string;
  avatarType: 'boy' | 'girl';
};

export type ContactData = {
  id: string;
  name: string;
};

export type TeacherData = {
  id: string;
  name: string;
  classroom: string;
};
