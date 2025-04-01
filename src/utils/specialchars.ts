export const doublequotes = '^_sz1'

export const escapeDoublequotes = (data: string): string => {
  // Replace all double quotes with the escape sequence
  return data.replace(/"/g, doublequotes);
};

export const addDoublequotes = (data: string): string => {
  // Replace the escape sequence with actual double quotes
  return data.replace(new RegExp(doublequotes, 'g'), '"');
};