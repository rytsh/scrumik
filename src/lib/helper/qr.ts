import { AwesomeQR } from "awesome-qr";

const generateQR = async (text: string, size = 300) => {
  const buffer = await new AwesomeQR({
    text: text,
    size: size,
  }).draw();

  return buffer as string;
};

export { generateQR };
