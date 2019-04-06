import React from "react";
import Box from "grommet/components/Box";
import Heading from "grommet/components/Heading";

export const HasLateVisitTag = () =>
    <Box
        alignContent="start"
        alignSelf="start"
        margin={{ vertical: "small" }}
        pad={{ horizontal: "small" }}
        colorIndex="warning"
    >
        <Heading
            tag="h6"
            uppercase={true}
            truncate={true}
            margin="none"
        >
            HAS A LATE VISIT
      </Heading>
    </Box>
