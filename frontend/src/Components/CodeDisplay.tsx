import React from "react";
import SyntaxHighlighter from "react-syntax-highlighter";
import { docco } from "react-syntax-highlighter/dist/esm/styles/hljs";
import styled from "styled-components";

interface CodeDisplayProps {
  code: string;
  language?: string;
  title?: string;
}

export const CodeDisplay: React.FC<CodeDisplayProps> = ({
  code,
  language = "javascript",
  title,
}) => {
  return (
    <CodeContainer>
      {title && <CodeTitle>{title}</CodeTitle>}
      <StyledSyntaxHighlighter language={language} style={docco}>
        {code}
      </StyledSyntaxHighlighter>
    </CodeContainer>
  );
};

const CodeContainer = styled.div`
  margin: 15px 0;
  border-radius: 8px;
  overflow: hidden;
  background: #f5f5f5;
  border: 1px solid #ddd;
`;

const CodeTitle = styled.div`
  background: #282c34;
  color: white;
  padding: 10px 15px;
  font-weight: bold;
  font-size: 14px;
`;

const StyledSyntaxHighlighter = styled(SyntaxHighlighter)`
  margin: 0 !important;
  padding: 15px !important;
  font-size: 13px !important;
  line-height: 1.5 !important;
`;
