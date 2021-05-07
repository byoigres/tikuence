import React, { Fragment, useState, useEffect } from 'react';
import { Inertia } from '@inertiajs/inertia';
import { usePage } from '@inertiajs/inertia-react';
import Paper from '@material-ui/core/Paper';
import RestoreIcon from '@material-ui/icons/Restore';
import WbSunnyIcon from '@material-ui/icons/WbSunny';
import { makeStyles } from '@material-ui/core/styles';
import SEO from '../components/SEO';
import Layout from '../components/Layout';
import InertiaModals from '../components/InertiaModals';
import PillsNavigation, { PillAction } from '../components/PillsNavigation';
import ThumbnailInfiniteList from '../components/ThumbnailInfiniteList';

const usePaperStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}));

const categories = [
  {
    id: 'recent',
    label: 'Recently updated',
    pageTitle: 'Recent lists',
    icon: <RestoreIcon />,
  },
  {
    id: 'new',
    label: 'New lists',
    pageTitle: 'New lists',
    icon: <WbSunnyIcon />,
  },
];

const PageFeed = () => {
  const {
    props: {
      isMobile,
      category: initialCategory = 'recent',
      lists: initialLists = [],
      modal = false,
    },
  } = usePage();
  const paperClasses = usePaperStyles({ isMobile });
  const [lists, setLists] = useState(initialLists);
  const [categoryIndex] = useState(categories.findIndex((x) => x.id === initialCategory));
  const [category, setCategory] = useState(initialCategory);
  const [currentPage, setCurrentPage] = useState(1);
  const [isTheEnd, setIsTheEnd] = useState(false);
  const [isSwitchingCategory, setIsSwitchingCategory] = useState(false);

  useEffect(() => {
    if (currentPage > 1) {
      Inertia.visit('/', {
        only: ['auth', 'flash', 'errors', 'lists'],
        preserveScroll: true,
        preserveState: true,
        headers: {
          'X-Feed-Category': category,
          'X-Feed-Page': currentPage,
        },
        onSuccess: ({ props: { lists: newLists } }) => {
          if (newLists.length > 0) {
            setLists([...lists, ...newLists]);
          } else {
            setIsTheEnd(true);
          }
        },
      });
    }
  }, [currentPage]);

  return (
    <>
      <SEO title={categories[categoryIndex].pageTitle} />
      <Paper classes={{ ...paperClasses }} square elevation={1}>
        <PillsNavigation
          value={category}
          onChange={(_, selectedCategory) => {
            // Set category here to select the current pill while loading the data
            setCategory(() => selectedCategory);
            if (selectedCategory !== category) {
              Inertia.visit('/', {
                headers: {
                  'X-Feed-Category': selectedCategory,
                },
                onStart() {
                  setIsSwitchingCategory(true);
                },
              });
            }
          }}
        >
          <PillAction value="recent" label="Recently updated" icon={<RestoreIcon />} />
          <PillAction value="new" label="New lists" icon={<WbSunnyIcon />} />
        </PillsNavigation>
        <ThumbnailInfiniteList
          referer="feed"
          isLoading={isSwitchingCategory}
          lists={lists}
          isTheEnd={isTheEnd}
          endOfListText="You reached the end of the lists"
          noItemsText="There are no list to show"
          modal={modal}
          onEnter={() => {
            if (lists.length > 0) {
              setCurrentPage(currentPage + 1);
            }
          }}
        />
      </Paper>
      <InertiaModals modal={modal} />
    </>
  );
};

PageFeed.layout = (page) => <Layout children={page} />;

export default PageFeed;
