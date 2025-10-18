from pydantic import BaseModel
from typing import List

class TaskItem(BaseModel):
    task: str
    time: str

class TaskInput(BaseModel):
    barangay_id: int
    tasks: List[TaskItem]

class TaskSuggestion(BaseModel):
    task: str
    suggestion: str

class Tip(BaseModel):
    is_do: bool
    main_text: str
    sub_text: str