import styled, { css } from 'styled-components/native';

export interface IRadioButtonProps {
  selected: boolean;
}

export const Container = styled.TouchableOpacity<IRadioButtonProps>`
  width: 104px;
  height: 82px;
  padding: 14px 16px;
  border-radius: 8px;

  ${({ theme, selected }) => css`
    border: 1px solid
      ${selected ? theme.COLORS.SUCCESS_900 : theme.COLORS.SHAPE};
    background-color: 1px solid
      ${selected ? theme.COLORS.SUCCESS_50 : theme.COLORS.TITLE};
  `}
`;

export const Title = styled.Text`
  font-size: 16px;

  ${({ theme }) => css`
    font-family: ${theme.FONTS.TITLE};
    color: ${theme.COLORS.SECONDARY_900};
  `}
`;

export const RadioContainer = styled.View`
  width: 20px;
  height: 20px;
  border-radius: 10px;
  border: 1px solid ${({ theme }) => theme.COLORS.SECONDARY_900};
  margin-bottom: 16px;
  justify-content: center;
  align-items: center;
`;

export const RadioSelected = styled.View`
  width: 8px;
  height: 8px;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.COLORS.SUCCESS_900};
`;
