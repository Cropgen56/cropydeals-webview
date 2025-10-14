export const limitText = (text, limit = 120) => {
    if (!text) return "";
    if (text.length <= limit) return text;
    return text.slice(0, limit) + "...";
};