import { Card, CardContent, Typography, Box } from '@mui/material';

const FeatureCard = ({ icon, title, description }) => {
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', boxShadow: 3 }}>
      <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
        <Box sx={{ mb: 2 }}>
          {icon}
        </Box>
        <Typography gutterBottom variant="h5" component="h3" sx={{ fontWeight: 600 }}>
          {title}
        </Typography>
        <Typography>
          {description}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default FeatureCard;