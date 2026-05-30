export const buildNoteFilter = ({ tag, search }) => {
  const filter = {};
  const normalizedSearch = search?.trim();

  if (tag) {
    filter.tag = tag;
  }

  if (normalizedSearch) {
    filter.$text = { $search: normalizedSearch };
  }

  return filter;
};
