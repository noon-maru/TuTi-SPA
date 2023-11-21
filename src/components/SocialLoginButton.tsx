import { PropsWithoutRef } from "react";

import styled from "styled-components";

export interface SocialLoginButtonProps {
  icon: string;
  backgroundColor: string;
  text: string;
  textColor: string;
  onClick: () => void;
}

interface LoginButtonProps {
  bgColor: string;
}

const SocialLoginButton = ({
  icon,
  backgroundColor,
  text,
  textColor,
  onClick,
}: PropsWithoutRef<SocialLoginButtonProps>) => {
  return (
    <LoginButton bgColor={backgroundColor} onClick={onClick}>
      {/* 소셜 로그인 버튼 디자인 및 내용 */}
      <Icon src={icon} />
      <LoginText textColor={textColor}>{text}</LoginText>
    </LoginButton>
  );
};

const LoginButton = styled.div<LoginButtonProps>`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 3px;

  background-color: ${(props) => props.bgColor};

  width: 300px;
  height: 45px;

  border-radius: 100px;
`;

const Icon = styled.img`
  width: 18px;
  height: 18px;
`;

const LoginText = styled.p<{ textColor: string }>`
  color: ${(props) => props.textColor};
  font-size: 14.5px;
`;

export default SocialLoginButton;
