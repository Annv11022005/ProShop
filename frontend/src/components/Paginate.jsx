import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from '@/components/ui/pagination';

import { useLocation } from 'react-router-dom';

const Paginate = ({ page, pages, isAdmin = false, keyword = '' }) => {
  const { search } = useLocation();

  return (
    pages > 1 && (
      <Pagination>
        <PaginationContent>
          {[...Array(pages).keys()].map((x) => (
            <PaginationItem key={x + 1}>
              <PaginationLink
                to={
                  (!isAdmin
                    ? keyword
                      ? `/search/${keyword}/page/${x + 1}`
                      : `/page/${x + 1}`
                    : `/admin/product-list/${x + 1}`) + search
                }
                isActive={x + 1 === page}
              >
                {x + 1}
              </PaginationLink>
            </PaginationItem>
          ))}
        </PaginationContent>
      </Pagination>
    )
  );
};

export default Paginate;
