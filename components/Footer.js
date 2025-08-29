import { Box, Container, Grid, Typography, Link as MuiLink, IconButton } from '@mui/material';
import Link from 'next/link';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    {
      title: 'Company',
      links: [
        { name: 'About Us', href: '/about' },
        { name: 'Our Services', href: '/services' },
        { name: 'Careers', href: '/careers' },
        { name: 'Contact Us', href: '/contact' },
      ],
    },
    {
      title: 'Resources',
      links: [
        { name: 'FAQ', href: '/faq' },
        { name: 'Blog', href: '/blog' },
        { name: 'Terms of Service', href: '/terms' },
        { name: 'Privacy Policy', href: '/privacy-policy' },
      ],
    },
    {
      title: 'Tenants',
      links: [
        { name: 'Sign In', href: '/signin' },
        { name: 'Sign Up', href: '/signup' },
        { name: 'Tenant Portal', href: '/tenant/dashboard' },
      
      ],
    },
  ];

  return (
    <Box component="footer" sx={{ bgcolor: '#FFFFFF', py: 6, mt: 'auto', borderTop: 1, borderColor: 'divider' }}>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {footerLinks.map((section) => (
            <Grid item xs={12} sm={6} md={3} key={section.title}>
              <Typography variant="h6" color="text.primary" gutterBottom>
                {section.title}
              </Typography>
              <Box>
                {section.links.map((link) => (
                  <Box key={link.name} sx={{ mb: 1 }}>
                    <MuiLink
                      component={Link}
                      href={link.href}
                      color="text.secondary"
                      sx={{
                        textDecoration: 'none',
                        '&:hover': {
                          color: 'primary.main',
                          textDecoration: 'underline',
                        },
                      }}
                    >
                      {link.name}
                    </MuiLink>
                  </Box>
                ))}
              </Box>
            </Grid>
          ))}

          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Connect With Us
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton 
                aria-label="Facebook" 
                color="primary"
                component="a"
                href="https://www.facebook.com/share/1KnNBRv4Xu/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FacebookIcon />
              </IconButton>
              <IconButton aria-label="Twitter" color="primary">
                <TwitterIcon />
              </IconButton>
              <IconButton aria-label="Instagram" color="primary">
                <InstagramIcon />
              </IconButton>
              <IconButton aria-label="LinkedIn" color="primary">
                <LinkedInIcon />
              </IconButton>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              ARKEDIA HOMES, NANDA LANE,<br />
              IN FRONT OF SRIKRISHNA MANDAP,<br />
              KULUTHKANI, DHANUPALI, SAMBALPUR<br />
              info@arkediahomes.com<br/>
              PHONE:9692606186
            </Typography>
          </Grid>
        </Grid>

        <Box mt={5}>
          <Typography variant="body2" color="text.secondary" align="center">
            © {currentYear} Arkedia Homes. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;