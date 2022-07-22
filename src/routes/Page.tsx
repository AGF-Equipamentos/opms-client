import { useEffect } from 'react';

export type PageProps = {
  title: string;
  children: React.ReactElement;
};

const Page = (props: PageProps): JSX.Element => {
  useEffect(() => {
    document.title = props.title || '';
  }, [props.title]);
  return props.children;
};

export default Page;
