import { FC } from 'react';
import ProfileIcon from '../common/ProfileIcon';
import { getFirstLetter, trimText } from '../../utils/helper';
import { BsBoxArrowUpRight } from 'react-icons/bs';
import parse from 'html-react-parser';
import { LatestComment } from '../../utils/types';

interface Props {
  comment: LatestComment
}

const LatestCommentListCard: FC<Props> = ({ comment }): JSX.Element => {
  const { owner, content, belongsTo } = comment;
  const { name, avatar } = owner;
  const { slug, title } = belongsTo;
  return <div className='flex space-x-2'>
    <ProfileIcon nameInitial={getFirstLetter(name)} avatar={avatar} />
    <div className='flex-1'>
      <p className='font-semibold transition text-primary-dark dark:text-primary'>{name} <span className='text-sm text-secondary-dark'>
        commented on </span></p>
      <a href={`/${slug}`} target='_blank' rel='noreferrer noopener' className='transition text-secondary-dark hover:underline'>
        <div className='flex items-center space-x-2'>
          <BsBoxArrowUpRight size={12} />
          {trimText(title, 30)}
        </div>
      </a>
      <div className='transition text-primary-dark dark:text-primary'>{parse(content)}</div>
    </div>
  </div>;
};

export default LatestCommentListCard;