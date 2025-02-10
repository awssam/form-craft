import { getAppOriginUrl } from '@/lib/utils';

const FormFooter = () => {
  return (
    <div className="text-white text-xs mx-auto -mt-5">
      Powered by{' '}
      <b>
        <a href={getAppOriginUrl()} className="text-blue-500">
          VI Forms
        </a>
      </b>
    </div>
  );
};

export default FormFooter;
