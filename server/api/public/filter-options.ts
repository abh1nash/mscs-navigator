import * as certificates from "~/server/data/certificates";

export default defineEventHandler(async (event) => {
  const certs = await certificates.filter({}, 0, 100);
  return {
    certificates: certs.data.map((certificate) => ({
      label: certificate.name,
      value: certificate.id,
    })),
  };
});
