
const ShinyText = ({ text, disabled = false, speed = 5, className = '' }) => {
  const animationDuration = `${speed}s`;

  return (
    <div
      className={`shiny-text ${disabled ? 'disabled' : ''} ${className}`}
      style={{ animationDuration }}
    >
      {text}
    </div>
  );
};


// const ShinyText = ({ text, disabled = false, speed = 5, className = '' }) => {
//   const animationDuration = `${speed}s`;

//   return (
//     <div
//       className={`text-[#b5b5b510] bg-clip-text  font-bold inline-block ${disabled ? '' : 'animate-shine'} ${className}`}
//       style={{
//         backgroundImage: 'linear-gradient(120deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.8) 50%, rgba(255,255,255,0.2) 100%)',
//         backgroundSize: '200% 100%',
//         WebkitBackgroundClip: 'text',
//         animationDuration: animationDuration,
//       }}
//     >
//       {text}
//     </div>
//   );
// };

export default ShinyText;

