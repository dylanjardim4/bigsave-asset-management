import QRCode from 'qrcode';

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const assetUrl = `https://internal.bigsave.local/assets/${params.id}`;
  const dataUrl = await QRCode.toDataURL(assetUrl, { width: 300, margin: 1 });
  const base64 = dataUrl.split(',')[1];

  return new Response(Buffer.from(base64, 'base64'), {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=3600'
    }
  });
}
