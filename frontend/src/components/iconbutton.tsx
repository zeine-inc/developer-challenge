interface IconButtonProps {
  imagem: string;
  ativo: boolean;
  border?: boolean;
  onClick: () => void;
}

export default function IconButton({ ...props }: IconButtonProps) {
  return (
    <button
      onClick={props.onClick}
      className={`
        ${props.border ? "border border-[var(--border-primary)]" : ""}
        ${
          props.ativo
            ? "bg-[var(--background-tertiary)]"
            : "bg-[var(--background-secondary)]"
        } flex gap-[1rem] p-[0.7rem] rounded-xl cursor-pointer`}>
      <img src={props.imagem} className="w-[1.25rem] h-[1.25rem]" />
    </button>
  );
}
