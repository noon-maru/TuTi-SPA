import styled from "styled-components";

interface AdditionalInputBoxProps {
  label: string;
  placeholder?: string;
  list: any[];
  setList: React.Dispatch<React.SetStateAction<any>>;
  handleChange?: (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => void;
}

const AdditionalInputBox = ({
  label,
  placeholder,
  list,
  setList,
  handleChange,
}: AdditionalInputBoxProps) => {
  return (
    <label style={{ display: "flex", gap: 3 }}>
      {label}
      <div style={{ display: "flex", flexDirection: "column" }}>
        {list.map((item: any, index: number) => (
          <div>
            <input
              key={index}
              type="text"
              placeholder={placeholder}
              value={item}
              onChange={
                handleChange
                  ? (e) => handleChange(e, index)
                  : (e) =>
                      setList((prev: any) =>
                        prev.map((existItem: any, i: number) =>
                          i === index ? e.target.value : existItem
                        )
                      )
              }
            />
            {index === list.length - 1 && (
              <AddTagInput
                onClick={() => setList((prev: any) => [...prev, ""])}
              >
                {"+"}
              </AddTagInput>
            )}
          </div>
        ))}
      </div>
    </label>
  );
};

const AddTagInput = styled.span`
  border-width: 1px;
  border-style: solid;
  border-color: black;
  border-radius: 5px;

  margin-left: 5px;
  padding: 0px 5px;
`;

export default AdditionalInputBox;
