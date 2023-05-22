import { FC } from 'react';
import Head from 'next/head';

interface Props {
  title?: string;
  meta?: string;
}

export const APP_NAME = 'Dev Blog'

const AppHead: FC<Props> = ({ title, meta }): JSX.Element => {
  return <Head>
    <title>{title ? `${title} | ${APP_NAME}` : APP_NAME}</title>
    <meta name="description" content={meta} />
  </Head>;
};

export default AppHead;