import {
  Item,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from '@/components/ui/item';

export function SelectPlanItem({ plan }) {
  if (!plan) return null;

  return (
    <Item size='xs' className='w-full p-0'>
      <ItemContent className='gap-0'>
        <ItemTitle>{plan.name}</ItemTitle>
        <ItemDescription className='text-xs'>
          {plan.description}
        </ItemDescription>
      </ItemContent>
    </Item>
  );
}
