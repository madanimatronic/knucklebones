import Head from 'next/head';
import { FC } from 'react';

interface SeoProps {
  headTitle: string;
  metaDescription: string;
  iconLink: string;
}

export const Seo: FC<SeoProps> = ({ headTitle, metaDescription, iconLink }) => {
  return (
    <Head>
      <title>{headTitle}</title>
      <meta name='description' content={metaDescription} />
      <meta name='viewport' content='width=device-width, initial-scale=1' />
      <link rel='icon' href={iconLink} />
    </Head>
  );
};
