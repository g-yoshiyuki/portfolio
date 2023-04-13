import { createContext, useContext, useState, ReactNode } from 'react';

type AnimationContextType = {
  animationFinished: boolean;
  setAnimationFinished: (value: boolean) => void;
};

// アプリケーション内でアニメーションの状態を共有するために使用する
const AnimationContext = createContext<AnimationContextType | undefined>(undefined);

export const useAnimationContext = () => {
  // AnimationContextの現在の値にアクセス
  const context = useContext(AnimationContext);
  if (!context) {
    throw new Error('useAnimationContext must be used within an AnimationProvider');
  }
  return context;
};

interface AnimationProviderProps {
  children: ReactNode;
}
// 以下により_app.tsxでAnimationProviderでラップすることでコンポーネント内のどこでも、useAnimationContextフックを使ってanimationFinishedおよびsetAnimationFinishedにアクセスできる
export const AnimationProvider: React.FC<AnimationProviderProps> = ({ children }) => {
  const [animationFinished, setAnimationFinished] = useState(false);

  return (
    <AnimationContext.Provider value={{ animationFinished, setAnimationFinished }}>
      {children}
    </AnimationContext.Provider>
  );
};
