const today = new Date();
today.setHours(0, 0, 0, 0);

export const isPastDate = (date: Date) => {
    return date < today;
};