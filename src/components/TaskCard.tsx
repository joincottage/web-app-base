import React from 'react';
import { Theme } from '@material-ui/core/styles';
import { makeStyles, createStyles } from '@material-ui/styles';
import clsx from 'clsx';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { red } from '@material-ui/core/colors';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ShareIcon from '@material-ui/icons/Share';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { Button } from '@material-ui/core';
import { Task } from '.prisma/client';
import Chip from '@material-ui/core/Chip';
import { ClientInfo } from './ClientTabs';

interface OwnProps {
  task: Task;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      borderRadius: 0,
    },
    media: {
      height: 0,
      paddingTop: '56.25%', // 16:9
    },
    ctaButton: {},
    primaryActionsContainer: {
      marginLeft: 'auto',
    },
    expand: {
      transform: 'rotate(0deg)',
      transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
      }),
    },
    expandOpen: {
      transform: 'rotate(180deg)',
    },
    avatar: {
      backgroundColor: red[500],
    },
  }),
);

export default function TaskCard({ task }: OwnProps) {
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <Card className={classes.root}>
      <CardHeader
        avatar={ <Avatar sx={{ width: 24, height: 24 }} alt="Company logo" src={task.clientImgUrl || ''} aria-haspopup="true" /> }
        action={
          <IconButton aria-label="settings">
            <MoreVertIcon />
          </IconButton>
        }
        title={task.name}
        subheader="October 14, 2021"
      />
      <CardContent>
        <Typography variant="body2" color="textSecondary" component="p">
          { task.shortDesc }
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        { task.skills?.split(',').map(skill => <Chip label={skill} style={{ marginLeft: '5px' }} />)}
        <div className={classes.primaryActionsContainer}>
          <Button
            className={classes.ctaButton}
            variant="outlined"
            color="primary"
            onClick={handleExpandClick}
            aria-expanded={expanded}
          >
            Learn more
          </Button>
        </div>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Typography paragraph>{ task.longDesc }</Typography>
        </CardContent>
        <CardActions disableSpacing>
          <div className={classes.primaryActionsContainer}>
            <Button
              className={classes.ctaButton}
              variant="contained"
              color="primary"
            >
              I'll do it!
            </Button>
          </div>
        </CardActions>
      </Collapse>
    </Card>
  );
}