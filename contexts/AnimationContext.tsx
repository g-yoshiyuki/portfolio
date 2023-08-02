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



// 以下はisInitialLoadを追加したパターン
// import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
// import { useRouter } from 'next/router';

// type AnimationContextType = {
//   animationFinished: boolean;
//   setAnimationFinished: (value: boolean) => void;
//   isInitialLoad: boolean;
// };
// // アプリケーション内でアニメーションの状態を共有するために使用する
// const AnimationContext = createContext<AnimationContextType | undefined>(undefined);

// export const useAnimationContext = () => {
//    // AnimationContextの現在の値にアクセス
//   const context = useContext(AnimationContext);
//   if (!context) {
//     throw new Error('useAnimationContext must be used within an AnimationProvider');
//   }
//   return context;
// };

// interface AnimationProviderProps {
//   children: ReactNode;
// }
// // 以下により_app.tsxでAnimationProviderでラップすることでコンポーネント内のどこでも、useAnimationContextフックを使ってアクセスできる
// export const AnimationProvider: React.FC<AnimationProviderProps> = ({ children }) => {
//   const [animationFinished, setAnimationFinished] = useState(false);
//   const [isInitialLoad, setIsInitialLoad] = useState(true);
//   const router = useRouter();

//   // animationFinishedはローディング画面が完了したことを通知してheroアニメーションを実行する目的で用意している。
//   // isInitialLoadはローディング画面を初期表示にするために用意している。
//   useEffect(() => {
//     // routeChangeCompleteイベントはページ遷移が完了したときに発火します。
//     // これにより、最初のロードが終了したことを示すためにisInitialLoadをfalseに設定します。
//     const handleRouteChange = () => {
//       setIsInitialLoad(false);
//     };
//     router.events.on('routeChangeComplete', handleRouteChange);
//     // コンポーネントがアンマウントされるときにイベントリスナーを削除します。
//     return () => {
//       router.events.off('routeChangeComplete', handleRouteChange);
//     };
//   }, [router]);

//   return (
//     <AnimationContext.Provider value={{ animationFinished, setAnimationFinished, isInitialLoad }}>
//       {children}
//     </AnimationContext.Provider>
//   );
// };
