import React from 'react';
import { Stack, Skeleton } from '@mui/material';

const SkeletonList = () => (
  <Stack spacing={1} sx={{marginX: '1rem', marginTop: '0.5rem'}}>
    {
      Array.from({ length: 7 }).map((_, index) => (
        <Skeleton key={index} variant="rectangular" width={'100%'} height={60} />
      ))
    }
  </Stack>
);

export default SkeletonList;