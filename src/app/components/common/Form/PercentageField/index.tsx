import styled from 'styled-components';

import { container } from './styles';

interface PercentageFieldProps {
  percentage: number;
  error?: boolean;
}

const Container = styled.div`
  ${container}
`;

const PercentageField = ({ percentage, error = false }: PercentageFieldProps) => {
  return <Container error={error}>
    {percentage}%
  </Container>;
};

export default PercentageField;
