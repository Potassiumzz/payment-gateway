from pydantic import BaseModel, ConfigDict
from pydantic.alias_generators import to_camel


class CamelModel(BaseModel):
	model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)


class CamelResponseModel(CamelModel):
	model_config = CamelModel.model_config | {"from_attributes": True}
