export type ScoutNoteDTO = {
  id: string;
  content: string;
  createdAt: string;
  authorId: string;
  authorName: string;
  profileId: string;
};

export type CreateScoutNoteInput = {
  content: string;
  profileId: string;
  authorId: string;
};
