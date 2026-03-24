import avatar1 from "@img/avatars/avatar1.webp";
import avatar2 from "@img/avatars/avatar2.webp";
import avatar3 from "@img/avatars/avatar3.webp";
import avatar4 from "@img/avatars/avatar4.webp";
import avatar5 from "@img/avatars/avatar5.webp";

const RANDOM_AVATARS = [avatar1, avatar2, avatar3, avatar4, avatar5];

export const getAvatar = () => {
  const randomIndex = Math.floor(Math.random() * RANDOM_AVATARS.length);
  return RANDOM_AVATARS[randomIndex];
};
