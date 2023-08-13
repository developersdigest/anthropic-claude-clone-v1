"use client";

// 1. Import necessary modules and components
import { useChat } from "ai/react";
import { useState, useEffect } from "react";
import {
  Function,
  Paperclip,
  ArrowFatRight,
  XCircle,
  Circle,
  CheckCircle,
  User,
} from "@phosphor-icons/react";

// 2. Define the ModelSelector component
function ModelSelector({ onSelectModel }) {
  // 3. Initialize state for the currentModel
  const [currentModel, setCurrentModel] = useState({
    model: "claude-2-100k",
    src: "anthropic-logo.png",
    alt: "Anthropic Logo",
  });

  // 4. Define modelSelection array
  const modelSelection = [
    {
      model: "claude-2-100k",
      src: "anthropic-logo.png",
      alt: "Anthropic Logo",
    },
    {
      model: "gpt-3.5",
      src: "openai-logo.png",
      alt: "OpenAI Logo",
    },
  ];

  // 5. Define handleClick function
  const handleClick = () => {
    const currentIndex = modelSelection.findIndex(
      (image) => image.src === currentModel.src
    );
    const nextIndex = (currentIndex + 1) % modelSelection.length;
    setCurrentModel(modelSelection[nextIndex]);
    onSelectModel(modelSelection[nextIndex].model);
  };

  // 6. Return JSX for ModelSelector component
  return (
    <div className="absolute left-0 top-0">
      <div className="fixed z-10 left-3 top-3 right-3 grid gap-3 grid-cols-[auto_1fr_auto] font-semibold ">
        <button
          type="button"
          className="bg-white rounded-full p-1.5 shadow-element transition-transform ease-in-out active:scale-90 focus:ring outline-none"
          onClick={handleClick}
        >
          <div>
            <img
              className="max-w-[35px] max-h-[35px]"
              src={currentModel.src}
              alt={currentModel.alt}
            />
          </div>
        </button>
      </div>
    </div>
  );
}

// 7. Define WelcomeBack component
function WelcomeBack() {
  return (
    <>
      <h1 className="text-center tracking-tighter mt-8 mb-8 sm:mb-12 text-5xl">
        Welcome back <span className="animate-pulse">🦜</span>
      </h1>
    </>
  );
}

// 8. Define VectorSelector component
function VectorSelector({ onSelectVectorStorage }) {
  // 9. Initialize state for currentIcon
  const [currentIcon, setCurrentIcon] = useState({
    vectorName: "Supabase",
    src: "supabase-logo.png",
    alt: "Supabase Logo",
  });

  // 10. Define iconSelection array
  const iconSelection = [
    {
      vectorName: "Supabase",
      src: "supabase-logo.png",
      alt: "Supabase Logo",
    },
    {
      vectorName: "Pinecone",
      src: "pinecone-logo.png",
      alt: "Pinecone Logo",
    },
  ];

  // 11. Define handleClick function
  const handleClick = () => {
    const currentIndex = iconSelection.findIndex(
      (icon) => icon.src === currentIcon.src
    );
    const nextIndex = (currentIndex + 1) % iconSelection.length;
    setCurrentIcon(iconSelection[nextIndex]);
    onSelectVectorStorage(iconSelection[nextIndex].vectorName);
  };

  // 12. Return JSX for VectorSelector component
  return (
    <div className="flex items-center bg-uivory-100 py-1 px-2 rounded-full cursor-pointer shadow transition-all ease-in-out active:scale-[0.98] text-ellipsis whitespace-nowrap overflow-x-hidden text-sm text-center mx-1 w-9 h-9  mt-5">
      <button type="button" onClick={handleClick}>
        <img src={currentIcon.src} alt={currentIcon.alt} />
      </button>
    </div>
  );
}

// 13. Define main App component
export default function App() {
  // 14. Initialize state variables
  const [showWelcomeBack, setShowWelcomeBack] = useState(true);
  const [isInputFocused, setInputFocused] = useState(false);
  const [files, setFiles] = useState([]);
  const [showSlideUp, setShowSlideUp] = useState(false);
  const [selectedModel, setSelectedModel] = useState("gpt-3.5");
  const [selectedVectorStorage, setSelectedVectorStorage] =
    useState("Supabase");
  const [functions, setFunctions] = useState([
    { name: "wikipediaQuery", active: false, label: "Wikipedia Search" },
    { name: "fetchCryptoPrice", active: false, label: "Crypto Price" },
  ]);

  // 15. Define chat related hooks using useChat()
  const { messages, input, handleInputChange, handleSubmit } = useChat();

  // 16. Handle vector storage selection
  const handleSelectedVectorStorage = (model) => {
    setSelectedVectorStorage(model);
  };

  // 17. Handle model selection
  const handleModelSelection = (model) => {
    setSelectedModel(model);
  };

  // 18. Handle input focus
  const handleInputFocus = () => {
    if (!showWelcomeBack) {
      setShowSlideUp(false);
    }
    setInputFocused(true);
  };

  // 19. Handle input blur
  const handleInputBlur = () => {
    setInputFocused(false);
  };

  // 20. Handle key down event
  const handleKeyDown = (event) => {
    if ((event.metaKey || event.ctrlKey) && event.key === "k") {
      setShowWelcomeBack((showWelcomeBack) => !showWelcomeBack);
    }
  };

  // 21. Attach keydown event listener
  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // 22. Hide welcome back message if messages are present
  useEffect(() => {
    if (messages.length > 0 && showWelcomeBack) {
      setShowWelcomeBack(false);
    }
  }, [messages]);

  // 23. Remove a file from the files state
  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  // 24. Handle file change event
  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files).slice(0, 5);
    const filePromises = selectedFiles.map((file) => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const base64File = e.target?.result;
          if (base64File) {
            resolve({
              base64: base64File,
              title: file.name,
              filetype: file.type,
              size: file.size,
            });
          }
        };
        reader.readAsDataURL(file);
      });
    });
    Promise.all(filePromises).then((fileObjects) => {
      setFiles(fileObjects);
    });
  };

  // 25. Handle icon click
  const handleIconClick = (index) => {
    const newFunctions = [...functions];
    newFunctions[index].active = !newFunctions[index].active;
    setFunctions(newFunctions);
    console.log(newFunctions[index]);
  };
  return (
    <>
      {/* 26. Include ModelSelector Component */}
      <ModelSelector onSelectModel={handleModelSelection} />
      {/* 27. Position input bar conditionally on whether it is the welcome screen */}
      <div
        className={`max-w-3xl w-full fixed overflow-y-auto ${
          showWelcomeBack ? "top-28" : "bottom-0"
        } mx-auto left-1/2 -translate-x-1/2`}
      >
        {showWelcomeBack && <WelcomeBack />}
        {messages.length > 0 && !showWelcomeBack
          ? messages.map((m, index) => (
              //  28. Conditional rendering based on user or assistant
              <div key={m.id} className="mr-3">
                {m.role === "user" ? (
                  <>
                    {/* 29. User message display */}
                    <div className="flex justify-end">
                      <div className="flex items-end col-start-3 pb-1 mx-2 opacity-100 transform-none">
                        <div className="rounded-xl px-3 py-2 break-words text-stone-900 transition-all bg-white place-self-end ">
                          <div className="contents">
                            <p className="whitespace-pre-wrap">{m.content}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-end col-start-3 pb-1 mx-2 opacity-100 transform-none">
                        {/* 30. User avatar */}
                        <div className="font-bold rounded-full flex items-center justify-center h-8 w-8 text-[14px] bg-ant-primary text-white bg-purple-800">
                          <User size={18} />
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    {/* 31. Assistant message display */}
                    <div className="flex justify-start my-2">
                      <div
                        className="font-bold rounded-full flex items-center justify-center mx-2 h-8 w-8 text-[14px] bg-white text-whitemx-2 
                    mt-0.5"
                      >
                        🦜
                      </div>
                      <div className="col-start-2 grid gap-2 opacity-100 transform-none">
                        {/* 32. Assistant message content */}
                        <div
                          className={`ReactMarkdown rounded-xl px-3 py-2 break-words text-stone-900 transition-all pb-1 grid gap-3 grid-cols-1 max-w-[75ch] bg-white place-self-start`}
                        >
                          <div className="contents">
                            <p className="whitespace-pre-wrap">{m.content}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))
          : null}
        <div className="bg-white rounded-md py-2 px-2 m-3">
          <fieldset className="sm:sticky sm:z-10 grid sm:pr-3 sm:grid-flow-col sm:grid-cols-[minmax(0,_1fr)_aufto] sm:gap-2 w-full rounded-3xl top-4 backdrop-blur-xl bg-white disabled:bg-white/50">
            <form
              onSubmit={(e) => {
                handleSubmit(e, {
                  options: {
                    body: {
                      selectedModel,
                      selectedVectorStorage,
                      files,
                      functions,
                    },
                  },
                });
              }}
            >
              {showSlideUp && (
                <div className="bg-white rounded-md py-2">
                  {functions.map((icon, index) => (
                    <label
                      key={index}
                      className="flex items-centerpy-0.5 px-0.5 rounded-full cursor-pointer transition-all ease-in-out text-sm"
                    >
                      {/* 33. Checkbox for functions */}
                      <input
                        type="checkbox"
                        value={icon.name}
                        checked={icon.active}
                        onChange={() => handleIconClick(index)}
                        className="hidden"
                        style={{ display: "none" }}
                      />
                      <span
                        className={`mr-2 pt-0.5 text-center ${
                          icon.active ? "border-black" : "border-black"
                        }`}
                      >
                        {/* 34. Check or circle icon based on function state */}
                        {icon.active ? (
                          <CheckCircle size={32} className="" />
                        ) : (
                          <Circle size={32} />
                        )}
                      </span>
                      <span className="text-black my-2">{icon.label}</span>
                    </label>
                  ))}
                </div>
              )}
              {/* 35. Textarea for user input */}
              <textarea
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
                className="p-1.5 resize-none focus:outline-none w-full h-8"
                value={input}
                placeholder="Message..."
                onChange={handleInputChange}
                name="message"
                autoComplete="off"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault(); // Prevent new line
                    handleSubmit(e, {
                      options: {
                        body: {
                          selectedModel,
                          selectedVectorStorage,
                          files,
                          functions,
                        },
                      },
                    });
                  }
                }}
              />
            </form>
            {/* 36. Function and attachment buttons */}
            <div className="flex justify-end absolute right-0 top-0 bottom-0">
              {selectedModel === "gpt-3.5" ? (
                <label>
                  <div onClick={() => setShowSlideUp(!showSlideUp)}>
                    <button className="w-full flex items-center bg-uivory-100 py-2 px-2 rounded-full cursor-pointer shadow transition-all ease-in-out active:scale-[0.98] text-ellipsis whitespace-nowrap overflow-x-hidden text-sm">
                      <div
                        className={`sc-imALrc jyzrrZ grid place-items-center w-5 h-5 ${
                          functions.some((func) => func.active)
                            ? "text-green-500 animate-pulse"
                            : "text-black"
                        }`}
                      >
                        <Function size={18} />
                      </div>
                    </button>
                  </div>
                </label>
              ) : null}
              {/* 37. Attachment button */}
              <label className="flex items-center bg-uivory-100 py-1 px-2 rounded-full cursor-pointer shadow transition-all ease-in-out active:scale-[0.98] text-ellipsis whitespace-nowrap overflow-x-hidden text-sm text-center mx-1 w-9 h-9">
                <div>
                  {/* 38. Input for attaching files */}
                  <input
                    type="file"
                    className="opacity-0 absolute inset-0 rounded-xl -z-10 overflow-hidden"
                    accept=".txt"
                    onChange={handleFileChange}
                    multiple
                  />
                </div>
                <Paperclip size={18} />
              </label>
              {/* 39. Start new chat button */}
              <div>
                <button className="w-full flex items-center bg-purple-800 text-white py-2 px-2 rounded-full cursor-pointer shadow transition-all ease-in-out active:scale-[0.98] text-ellipsis whitespace-nowrap overflow-x-hidden text-sm">
                  {showWelcomeBack ? "Start a new Chat" : ""}
                  <div className="grid place-items-center w-5 h-5">
                    <ArrowFatRight size={18} />
                  </div>
                </button>
              </div>
            </div>
          </fieldset>
          <div className="bg-white disabled:bg-white/50">
            <div className="flex flex-wrap gap-4 ">
              {/* 40. Display vector selector if files present */}
              {files.length > 0 ? (
                <VectorSelector
                  onSelectVectorStorage={handleSelectedVectorStorage}
                />
              ) : (
                ""
              )}
              {/* 41. Display attached files */}
              {files.map((file, index) => (
                <div
                  key={index}
                  className="mt-4 w-40 relative cursor-pointer rounded-md flex shadow text-xs bg-white shadow"
                >
                  <button className="absolute inset-0 cursor-pointer hover:bg-black/5 w-40"></button>
                  {/* 42. Display file type badge */}
                  <div className="flex-shrink-0 w-12 h-12 bg-purple-800 rounded-tl-md rounded-bl-md grid place-items-center text-white font-medium uppercase truncate">
                    {file.title.split(".")[1].toUpperCase()}
                  </div>
                  <div className="py-2 px-3 min-w-0">
                    <p className="truncate" title={file.name}>
                      {/* 43. Display file title */}
                      {file.title}
                    </p>
                    <div className="text-gray-500">
                      {/* 44. Display file size */}
                      {files.length > 0 &&
                        `${(files[0]?.size / 1024)?.toFixed(2)} KB`}
                    </div>
                    {/* 45. Remove attached file button */}
                    <div
                      className="absolute top-0 right-0 bg-white shadow rounded-full cursor-pointer hover:bg-stone-100 translate-x-2 -translate-y-2 z-10"
                      onClick={() => removeFile(index)}
                    >
                      <XCircle size={20} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div
          className="flex justify-end text-xs text-stone-400 delay-100 duration-500 transition-opacity mx-4"
          style={{ visibility: isInputFocused ? "visible" : "hidden" }}
        >
          {/* 46. Keyboard shortcuts info */}
          <strong>⏎</strong> to send, <strong>shift + ⏎</strong> to add a new
          line, <strong>⌘K</strong> to create a new chat
        </div>
      </div>
    </>
  );
}
