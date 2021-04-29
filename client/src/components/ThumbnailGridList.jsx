import React, { useEffect, useState } from 'react';
import { InertiaLink } from '@inertiajs/inertia-react';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import Divider from '@material-ui/core/Divider';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import InfoIcon from '@material-ui/icons/Info';
import ListIcon from '@material-ui/icons/List';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Fade from '@material-ui/core/Fade';
import { Inertia } from '@inertiajs/inertia';

const useStyles = makeStyles(() => ({
  gridListTileWrapper: {
    width: '100%',
    paddingTop: '178%',
    position: 'relative',
  },
  gridListTileContainer: ({ displayBlurImage }) => ({
    height: '100%',
    width: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    justifyContent: 'center',
    display: 'flex',
    alignItems: 'center',
    backgroundImage: displayBlurImage
      ? 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAABmJLR0QA/wD/AP+gvaeTAAAAB3RJTUUH5QQcEwQUBcRiJgAAA35JREFUSMfllk1oXFUUx3/nvvcmk3FSYkk0jVWMwVoDIrTUtVAXYheKKKhbV67EdbeCLl25FNxJURBEq1tRCrqzSD9CmkUwSVPaDJP5fu/d4+LOvK95b6qrLHphmPfevff8z/+c/zn3ytqXR8oxDHMcoI8msJ99UYVswrPPUngWSfdMPkrBuGYepDCZA15qCEvzboVMDInbaIEohkGs9ENojxQBFuuCVYgtdEIlsiT7T9QEb2ynFymDqATYKry3EfDhywFWU+8n/xZnfBQ7gM+vDWkNlM9erRMY6Efw6e9Dru3GAFx8xuOTV+aoec7GF3+O+HErwpMSxgs1WJwrBqxsCMsNYRDB2qJhzoPIpuyfaAgfnavx0rKT0N2ust2yuVTkxGX/R0XHtuhKmvM31n3OrXjJ3NWtiNuHFpNBThgrcL+vtAaKCDR8IUj3ogrdUAktxArtUV4wimO92hTe3wiSkP5zpHxzIyS2lAMbge9uRfy2E2MELj7r8/GFWmLgble5/OuA3Y6T/s6Rcn7FTKn9nbMBLy6ZxJkrN0JuPcizzQELcDhQHvSdMk/Ox0QWvDHrfqRcP7DsdxUjLi1ZY1bhwqrh0nqQOPP3PcuVmyH6sHKa1KcnLoe2UMiecXMyBvZEEoO+gQ82Ah6ruQ+jGL6+PmK3o0nUsqO8cwmEFqxqbuG4pFOvTSoqI9CsSfL+x17ML9vxVIhnAwOR1RxjI0wZCQylhq3C97dDJ9QK+zOAKQDLtEAqdhuB1aapZDsTONZMH2bcQgsK8cy0aCbjzed9nj4hlb2hFFhwoNkeURZqI/nGsdO2Sa9ef9xwad2nalQythQYM336SOaLCPx8J2LzMHX3rTMBp5rlrCuBi0ekCDNzBrDXUX7YTI+gMycNrz/nUxbtmReBqjM4iYpqzqhn4KetiJ22TVLx9gsBTzYkF72ZwNn8Td6LjGMlF5aaJ2y3LFfvpKw3lgyvrfnYov3SME+AM0Bm3NGyI4wLDUWcNr69mbL2BN4967M8n2ddrWpc777XUw56yn7XnUzZNe2Rm28P3a8XuT6+eWj56q+Qg5477U4vGM6veDnWUnWvrvtwqmkSL4exA4lsfs3pBUPdd719r6O0hi7vcx48tWCoey5y+13lfj/tZDLrQl8sg2KOlbz6i7qw2TnyqauucB5ePmVK/6/7H70L/bEB/wsqw3eeIml5sAAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAyMS0wNC0yOFQxOTowNDoyMC0wNDowMF2cOIsAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMjEtMDQtMjhUMTk6MDQ6MjAtMDQ6MDAswYA3AAAAAElFTkSuQmCC)'
      : 'none',
    // 'url(data:image/png;base64,/9j/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAoABcDASIAAhEBAxEB/8QAGQAAAgMBAAAAAAAAAAAAAAAAAAcDBAYF/8QAKhAAAAYBAwEHBQAAAAAAAAAAAAECAwQRBQYHEhMUFSEjQVFhMTIzcZH/xAAYAQACAwAAAAAAAAAAAAAAAAAABAECA//EAB0RAAICAgMBAAAAAAAAAAAAAAABAgMRIQQSMWH/2gAMAwEAAhEDEQA/ANdmNwoeZmRsRDxy2pZOETa74mR/JewYjSiRjFNuS0pfJNGuvoYjy2n8S+s5jePYTNSm+sRUZfIX0jNwm4sqEtDq5hvFxPnRGNk+2ooboh2TyVC1LmcblpsSLAPIuOK5G4lN0RADB0acZvHuJjkgpKT80r8bACU034YcjEbGilunnSw2LQ2xLaYfkeBczqgmscjEqdVIyOZaVIQs3E0r7g5td7fta1ahuKmnFeY9ePIjIxj0bBJJ0ne/Fcqr8JUIhaq/ETBzcOqklv7k4m3eYcXn50lbijiOXRpP1AGlo7buHpfGOsOu9sW65z5qTVAFXJPeBm26uTWdvBrYD8fpp5OJuvcXO0MlVOIr9gAKCJFMks9IvNT/AEAAAA//2Q==)'
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    // backgroundSize: 'cover',
  }),
  image: {
    width: '100%',
  },
}));

const useGridListStyles = makeStyles({
  root: {
    width: '100%',
  },
});

const useGridListTileStyles = makeStyles((theme) => ({
  tile: {
    outlineStyle: 'solid',
    outlineWidth: theme.spacing(0.2),
    outlineColor: theme.palette.grey[300],
  },
}));

const useTitleBarStyles = makeStyles((theme) => ({
  [theme.breakpoints.down('xs')]: {
    root: ({ displayInfo }) => ({
      height: displayInfo ? '100%' : 'auto',
      display: 'flex',
      flexDirection: 'column',
    }),
    titleWrap: ({ displayInfo }) => ({
      display: displayInfo ? 'initial' : 'none',
      marginTop: theme.spacing(1),
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
      marginBottom: theme.spacing(0),
      overflowY: 'scroll',
      '&::-webkit-scrollbar': {
        width: theme.spacing(0.5),
        background: 'transparent',
      },
      '&::-webkit-scrollbar-thumb': {
        background: theme.palette.grey[500],
        borderRadius: theme.spacing(1),
      },
      '&::-webkit-scrollbar-thumb:hover': {
        background: theme.palette.grey[700],
      },
    }),
    title: {
      whiteSpace: 'normal',
      lineHeight: theme.spacing(0.1625), // 1.3
    },
    actionIcon: {
      marginBottom: theme.spacing(0.5),
    },
  },
  [theme.breakpoints.up('sm')]: {
    rootSubtitle: {
      height: 120,
    },
    title: {
      lineHeight: 1.3,
      whiteSpace: 'normal',
      display: '-webkit-box',
      '-webkit-box-orient': 'vertical',
      '-webkit-line-clamp': 3,
    },
  },
  titleWrap: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    height: '100%',
  },
  title: {
    '& a': {
      color: theme.palette.common.white,
    },
  },
  subtitle: {
    color: theme.palette.common.white,
    lineHeight: theme.spacing(0.2), // 1.6
    '& a': {
      color: theme.palette.common.white,
    },
  },
}));

const useIconButtonStyles = makeStyles((theme) => ({
  [theme.breakpoints.up('sm')]: {
    root: ({ isInfoButton }) => ({
      display: isInfoButton ? 'none' : 'inline-flex',
    }),
  },
  root: {
    color: 'rgba(255, 255, 255, 0.54)',
  },
}));

const ThumbnailGridList = ({ children, referer, isMobile = false, scrollPosition }) => {
  const theme = useTheme();
  const gridListStyles = useGridListStyles();
  const isMediumAndUpMatch = useMediaQuery(theme.breakpoints.up('md'));

  return (
    <GridList cellHeight="auto" cols={isMediumAndUpMatch ? 4 : 3} classes={{ ...gridListStyles }}>
      {React.Children.map(children, (child) => {
        if (!React.isValidElement(child)) {
          return null;
        }

        return React.cloneElement(child, {
          isMobile,
          isMediumAndUpMatch,
          referer,
          scrollPosition,
        });
      })}
    </GridList>
  );
};

export const ThumbnailGridListItem = ({
  id,
  title,
  thumbnail,
  videos,
  username,
  isMobile,
  isMediumAndUpMatch,
  referer,
  style,
}) => {
  const [displayInfo, setDisplayInfo] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [displayBlurImage, setDisplayBlurImage] = useState(!thumbnail);
  const styles = useStyles({ thumbnail, displayBlurImage });
  const gridListTileStylesClasses = useGridListTileStyles({ isMobile });
  const titleBarClasses = useTitleBarStyles({ isMobile, displayInfo });
  const infoIconButtonStyles = useIconButtonStyles({ isInfoButton: true });
  const listIconButtonStyles = useIconButtonStyles({ isInfoButton: false });

  const onButtonInfoClick = (e) => {
    e.preventDefault();
    setDisplayInfo(!displayInfo);
  };

  const onListClick = (e) => {
    e.preventDefault();
    Inertia.visit(`/list/${id}`, {
      preserveScroll: true,
      preserveState: true,
      headers: { 'X-Page-Referer': referer },
      only: ['auth', 'flash', 'errors', 'modal', 'list', 'videos', 'referer'],
    });
  };

  useEffect(() => {
    if (!thumbnail) {
      const blurTimeout = setTimeout(() => {
        setDisplayBlurImage(true);
        clearTimeout(blurTimeout);
      }, 1000);
    }
  }, []);

  return (
    <GridListTile cols={1} classes={{ ...gridListTileStylesClasses }} style={style}>
      <div className={styles.gridListTileWrapper}>
        <div className={styles.gridListTileContainer}>
          <Fade in={!isLoading}>
            <a href={`/list/${id}`} onClick={onListClick} className={styles.image}>
              <img
                onLoad={() => {
                  setIsLoading(false);
                }}
                src={thumbnail}
                alt={title}
                className={styles.image}
              />
            </a>
          </Fade>
        </div>
      </div>
      <GridListTileBar
        title={
          <a href={`/list/${id}`} title={title} onClick={onListClick}>
            {title}
          </a>
        }
        subtitle={
          <>
            <Divider variant="fullWidth" />
            {username && <InertiaLink href={`/users/${username}`}>@{username}</InertiaLink>}
            <div>{videos} videos</div>
          </>
        }
        actionIcon={
          <>
            <Tooltip title="View list info">
              <IconButton
                aria-label={`info about ${title}`}
                classes={{ ...infoIconButtonStyles }}
                size={isMediumAndUpMatch ? 'medium' : 'small'}
                onClick={onButtonInfoClick}
              >
                <InfoIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="View list details">
              <IconButton
                aria-label={`info about ${title}`}
                classes={{ ...listIconButtonStyles }}
                size={isMediumAndUpMatch ? 'medium' : 'small'}
                onClick={(e) => {
                  e.preventDefault();
                  Inertia.visit(`/list/${id}/details`);
                }}
                href={`/list/${id}/details`}
              >
                <ListIcon />
              </IconButton>
            </Tooltip>
          </>
        }
        classes={{ ...titleBarClasses }}
      />
    </GridListTile>
  );
};

export default ThumbnailGridList;
