import React, { useState } from 'react';
import { Box } from '@mui/material';
import FaqItem from '../FaqItem';

const FaqList = ({ faqs }) => {
    const [expanded, setExpanded] = useState('panel0');

    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };

    return (
        <Box sx={{ position: 'relative', zIndex: 1 }}>
            {faqs.map((faq, index) => (
                <FaqItem
                    key={index}
                    question={faq.question}
                    answer={faq.answer}
                    index={index}
                    expanded={expanded}
                    onChange={handleChange(`panel${index}`)}
                />
            ))}
        </Box>
    );
};

export default FaqList;