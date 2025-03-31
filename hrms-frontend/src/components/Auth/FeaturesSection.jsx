import { Container, Typography, Grid, Box } from '@mui/material';
import { People, Assignment, Assessment } from '@mui/icons-material';
import FeatureCard from './FeatureCard';

const FeaturesSection = () => {
  const features = [
    {
      icon: <People fontSize="large" color="primary" />,
      title: 'Employee Management',
      description: 'Efficiently manage your workforce with comprehensive tools.',
    },
    {
      icon: <Assignment fontSize="large" color="primary" />,
      title: 'Leave Management',
      description: 'Streamline leave requests and approvals with our system.',
    },
    {
      icon: <Assessment fontSize="large" color="primary" />,
      title: 'Performance Analytics',
      description: 'Gain insights into employee performance with analytics.',
    },
  ];

  return (
    <Container maxWidth="xl" sx={{ py: 8 }}>
      <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: 600, mb: 6 }}>
        Key Features
      </Typography>
      <Grid container spacing={4}>
        {features.map((feature, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <FeatureCard {...feature} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default FeaturesSection;