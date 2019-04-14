import React from "react";
import Box from "grommet/components/Box";
import Heading from "grommet/components/Heading";

type Props = {
    text: String,
    color: String
}

export const Tag = ({ text, color = "warning" }: Props) =>
    <Box
        alignContent="start"
        alignSelf="start"
        margin={{ vertical: "small" }}
        pad={{ horizontal: "small" }}
        colorIndex={color}
    >
        <Heading
            tag="h6"
            uppercase={true}
            truncate={true}
            margin="none"
        >
            {text}
        </Heading>
    </Box>

export default Tag