import { Rating } from '@/components/reui/rating';
import { Button } from '@/components/ui/button';
import { Field, FieldGroup, FieldLabel, FieldSet } from '@/components/ui/field';
import { Textarea } from '@/components/ui/textarea';

const FormReview = ({
  rating,
  setRating,
  comment,
  setComment,
  loading,
  handler,
}) => {
  return (
    <form onSubmit={handler} className='border border-border bg-card p-5'>
      <FieldSet className='w-full'>
        <FieldGroup className='gap-5'>
          <Field>
            <FieldLabel className='mb-1.5 text-sm'>Your rating</FieldLabel>
            <Rating
              rating={rating}
              editable={true}
              onRatingChange={(value) => setRating(value)}
              showValue={true}
              size='lg'
            />
          </Field>

          <Field>
            <FieldLabel htmlFor='comment' className='text-sm'>
              Your review
            </FieldLabel>

            <Textarea
              id='comment'
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder='What did you like or dislike? What did you use this for?'
              className='min-h-28 resize-none'
            />
          </Field>

          <Field orientation='horizontal'>
            <Button
              size='lg'
              disabled={loading || rating === 0 || comment.trim() === ''}
              type='submit'
            >
              Submit review
            </Button>
          </Field>
        </FieldGroup>
      </FieldSet>
    </form>
  );
};

export default FormReview;
