import React from 'react';
import {
  Code as CodeIcon,
  Speed as SpeedIcon,
  Security as SecurityIcon,
  CloudUpload as CloudUploadIcon,
  Devices as DevicesIcon,
  AutoAwesome as AutoAwesomeIcon,
} from '@mui/icons-material';


export const features = [
    {
      icon: <CodeIcon sx={{ fontSize: 40 }} />,
      title: 'Intuitive Code Editor',
      description: 'Write clean, efficient code with our advanced editor featuring syntax highlighting and auto-completion.'
    },
    {
      icon: <SpeedIcon sx={{ fontSize: 40 }} />,
      title: 'Lightning Fast',
      description: 'Deploy your applications instantly with our optimized build process and global CDN network.'
    },
    {
      icon: <SecurityIcon sx={{ fontSize: 40 }} />,
      title: 'Enterprise Security',
      description: 'Keep your data safe with SSL encryption, automated backups, and advanced security protocols.'
    },
    {
      icon: <CloudUploadIcon sx={{ fontSize: 40 }} />,
      title: 'One-Click Deploy',
      description: 'Deploy your projects to production with a single click. No complex configurations needed.'
    },
    {
      icon: <DevicesIcon sx={{ fontSize: 40 }} />,
      title: 'Responsive Design',
      description: 'Build applications that look perfect on any device, from mobile phones to desktop screens.'
    },
    {
      icon: <AutoAwesomeIcon sx={{ fontSize: 40 }} />,
      title: 'AI-Powered Tools',
      description: 'Leverage artificial intelligence to generate code, optimize performance, and fix bugs automatically.'
    }
  ];