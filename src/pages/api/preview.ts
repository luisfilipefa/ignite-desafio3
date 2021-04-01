import { NextApiRequest, NextApiResponse } from 'next';
import linkResolver from '../../services/linkResolver';
import { getPrismicClient } from '../../services/prismic';

const Preview = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  const prismic = getPrismicClient(req);

  const { token: ref, documentId } = req.query;

  const redirectUrl = await prismic
    .getPreviewResolver(String(ref), String(documentId))
    .resolve(linkResolver, '/');

  res.setPreviewData({ ref });
  res.writeHead(302, { Location: `${redirectUrl}` });
  res.end();
};

export default Preview;
