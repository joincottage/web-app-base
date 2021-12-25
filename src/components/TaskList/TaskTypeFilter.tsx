import React, { useContext, useState } from 'react';
import CubeTransparentOutlineIcon from '../icons/CubeTransparentOutlineIcon';
import BugReportOutlinedIcon from '@material-ui/icons/BugReportOutlined';
import Chip from '@material-ui/core/Chip';
import { AppDataContext } from 'src/contexts/AppContext';
import setActiveFilters from 'src/actions/setActiveFilters';

interface OwnProps {
  style?: Record<string, any>;
}

const TaskTypeFilter = ({ style }: OwnProps) => {
  const [activeFilters, setComponentActiveFilters] = useState<string[]>([]);

  const { dispatch } = useContext(AppDataContext);

  const handleFilterClick = (filterType: string) => {
    const newActiveFilters = activeFilters.includes(filterType)
      ? activeFilters.filter((f) => f !== filterType)
      : [filterType, ...activeFilters];

    setComponentActiveFilters(newActiveFilters);
    dispatch(setActiveFilters(newActiveFilters));
  };

  return (
    <div style={{ ...style }}>
      <Chip
        avatar={
          <BugReportOutlinedIcon
            style={{
              fill: activeFilters.includes('bug') ? 'white' : '#E00004',
              background: 'none',
            }}
          />
        }
        label="Bugs"
        color="primary"
        clickable
        style={{ marginRight: '10px' }}
        variant={activeFilters.includes('bug') ? 'filled' : 'outlined'}
        onClick={handleFilterClick.bind(null, 'bug')}
      />
      <Chip
        avatar={
          <CubeTransparentOutlineIcon
            style={{
              color: activeFilters.includes('feature')
                ? 'white'
                : 'rgb(31,87,184)',
              background: 'none',
              margin: '0px -5px 0px 8px',
            }}
          />
        }
        label="Features"
        color="primary"
        clickable
        variant={activeFilters.includes('feature') ? 'filled' : 'outlined'}
        onClick={handleFilterClick.bind(null, 'feature')}
      />
    </div>
  );
};

export default TaskTypeFilter;
